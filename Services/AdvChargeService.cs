using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class AdvChargeService
{
    private readonly DapperService _dapperService;

    public AdvChargeService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<AdvCharge>> GetRecordsAsync(decimal orgId)
    {
        const string sql = @"SELECT AC.*, AM1.AccountName AS DrAccount, AM2.AccountName AS CrAccount, IM.ItemName
                             FROM AdvCharge AC
                             INNER JOIN AccountMaster AM1 ON AM1.AccountId = AC.DrAccountId
                             INNER JOIN AccountMaster AM2 ON AM2.AccountId = AC.CrAccountId
                             INNER JOIN ItemMaster IM ON IM.ItemId = AC.ItemId
                             WHERE AC.OrgId = @OrgId
                             ORDER BY AC.AdvChargeNo";

        return await _dapperService.QueryAsync<AdvCharge>(sql, new { OrgId = orgId });
    }

    public async Task<AdvCharge> GetRecordAsync(decimal orgId)
    {
        var entity = new AdvCharge
        {
            AdvChargeId = -1,
            AdvChargeNo = await GetOrderNoAsync(orgId),
            AdvChargeDt = DateTime.Now,
            OrgId = orgId
        };
        return entity;
    }

    public async Task<AdvCharge> GetAccountSummaryAsync(decimal accountId)
    {
        const string sql = @"SELECT TOP 1 AdvChargeId, Amount, SettleAmount
                             FROM AdvCharge
                             WHERE DrAccountId = @AccountId
                               AND SettleAmount < Amount
                             ORDER BY AdvChargeNo";

        var result = await _dapperService.QuerySingleOrDefaultAsync<AdvCharge>(sql, new { AccountId = accountId });
        return result ?? new AdvCharge();
    }

    public async Task<(bool Success, string ErrorMessage)> AddAsync(AdvCharge entity)
    {
        try
        {
            // Generate AdvChargeNo similar to legacy logic
            entity.AdvChargeNo = await GetOrderNoAsync(entity.OrgId);

            var parameters = new DynamicParameters();
            parameters.Add("@RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);
            parameters.Add("@OrgId", entity.OrgId, DbType.Int32);
            parameters.Add("@AdvChargeNo", entity.AdvChargeNo, DbType.String);
            parameters.Add("@ItemId", entity.ItemId, DbType.Decimal);
            parameters.Add("@DrAccountId", entity.DrAccountId, DbType.Decimal);
            parameters.Add("@CrAccountId", entity.CrAccountId, DbType.Decimal);
            parameters.Add("@Amount", entity.Amount, DbType.Decimal);
            parameters.Add("@TransactionId", entity.TransactionId, DbType.String);
            parameters.Add("@Remark", entity.Remark, DbType.String);
            parameters.Add("@Status", entity.Status, DbType.Int32);
            parameters.Add("@RefType", entity.RefType, DbType.Int32);
            parameters.Add("@RefId", entity.RefId, DbType.Decimal);

            await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_AdvCharge", parameters);

            entity.AdvChargeId = parameters.Get<decimal>("@RecordId");

            return (true, string.Empty);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task<bool> TransactionIdExistsAsync(decimal orgId, string transactionId)
    {
        const string sql = @"SELECT COUNT(1)
                             FROM AdvCharge
                             WHERE OrgId = @OrgId AND TransactionId = @TransactionId";

        var count = await _dapperService.QuerySingleOrDefaultAsync<int>(sql, new { OrgId = orgId, TransactionId = transactionId });
        return count > 0;
    }

    private async Task<string> GetOrderNoAsync(decimal orgId)
    {
        const string sql = @"SELECT TOP 1 AdvChargeNo
                             FROM AdvCharge
                             WHERE OrgId = @OrgId
                             ORDER BY AdvChargeId DESC";

        var lastNo = await _dapperService.QuerySingleOrDefaultAsync<string>(sql, new { OrgId = orgId });
        if (string.IsNullOrWhiteSpace(lastNo))
        {
            lastNo = "AC000";
        }

        var numericPart = 0m;
        if (lastNo.Length > 2)
        {
            decimal.TryParse(lastNo.Substring(2), out numericPart);
        }

        var nextNo = numericPart + 1;
        return $"AC{nextNo:000}";
    }

    public async Task<IEnumerable<AdvCharge>> GetRecordsToRevertAsync(decimal orgId, decimal accountId, string? fromDate, string? toDate)
    {
        var sql = @"SELECT ADVC.*, AM1.AccountName AS DrAccount, AM2.AccountName AS CrAccount, IM.ItemName
                    FROM AdvCharge ADVC
                    INNER JOIN AccountMaster AM1 ON AM1.AccountId = ADVC.DrAccountId
                    INNER JOIN AccountMaster AM2 ON AM2.AccountId = ADVC.CrAccountId
                    INNER JOIN ItemMaster IM ON IM.ItemId = ADVC.ItemId
                    WHERE ADVC.OrgId = @OrgId AND ADVC.Status = 0";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (accountId != -1)
        {
            sql += " AND ADVC.DrAccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }
        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND ADVC.AdvChargeDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }
        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND ADVC.AdvChargeDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        sql += " ORDER BY ADVC.AdvChargeId DESC";

        return await _dapperService.QueryAsync<AdvCharge>(sql, parameters);
    }

    public async Task<(bool Success, string ErrorMessage)> RevertAsync(decimal id)
    {
        try
        {
            var parameters = new DynamicParameters();
            parameters.Add("@AdvChargeId", id, DbType.Decimal);

            await _dapperService.ExecuteStoredProcedureAsync("Proc_Revert_AdvCharge", parameters);
            return (true, string.Empty);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }
}
