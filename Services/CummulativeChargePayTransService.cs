using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class CummulativeChargePayTransService
{
    private readonly DapperService _dapperService;

    public CummulativeChargePayTransService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<CummulativeChargePayTrans>> GetRecordsToRevertAsync(decimal orgId, decimal accountId, string? fromDate, string? toDate)
    {
        var sql = @"SELECT CCPT.*, AM1.AccountName AS DrAccount, AM2.AccountName AS CrAccount
                    FROM CummulativeChargePayTrans CCPT
                    INNER JOIN AccountMaster AM1 ON AM1.AccountId = CCPT.DrAccountId
                    INNER JOIN AccountMaster AM2 ON AM2.AccountId = CCPT.CrAccountId
                    WHERE CCPT.OrgId = @OrgId AND CCPT.Status = 0";

        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", orgId, DbType.Decimal);

        if (accountId != -1)
        {
            sql += " AND CCPT.DrAccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }
        if (!string.IsNullOrWhiteSpace(fromDate))
        {
            sql += " AND CCPT.AddedDt >= @FromDate";
            parameters.Add("@FromDate", fromDate, DbType.String);
        }
        if (!string.IsNullOrWhiteSpace(toDate))
        {
            sql += " AND CCPT.AddedDt <= @ToDate";
            parameters.Add("@ToDate", toDate, DbType.String);
        }

        sql += " ORDER BY CCPT.CummulativeChargePayTransId DESC";

        return await _dapperService.QueryAsync<CummulativeChargePayTrans>(sql, parameters);
    }

    public async Task<(bool Success, string ErrorMessage)> RevertAsync(decimal id)
    {
        try
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CummulativeChargePayTransId", id, DbType.Decimal);

            await _dapperService.ExecuteStoredProcedureAsync("Proc_Revert_CummulativeChargePayTrans", parameters);
            return (true, string.Empty);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task<bool> UpdateCummulativeChargePayTransAsync(ChargePayTrans entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("CummulativeChargePayTransId", entity.Id, DbType.Decimal);
        parameters.Add("TransMode", entity.TransMode, DbType.Decimal);
        parameters.Add("Remark", entity.Remark ?? string.Empty, DbType.String);
        parameters.Add("TransactionId", entity.TransactionId ?? string.Empty, DbType.String);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Update_CummulativeChargePayTrans", parameters);
        return true;
    }

    public async Task AddAsync(CummulativeChargePayTrans entity, IDbConnection connection, IDbTransaction transaction)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", entity.OrgId, DbType.Decimal);
        parameters.Add("@AccountId", entity.AccountId, DbType.Decimal);
        parameters.Add("@DrAccountId", entity.DrAccountId, DbType.Decimal);
        parameters.Add("@CrAccountId", entity.CrAccountId, DbType.Decimal);
        parameters.Add("@Amount", entity.Amount, DbType.Decimal);
        parameters.Add("@TransactionId", entity.TransactionId ?? string.Empty, DbType.String);
        parameters.Add("@Remark", entity.Remark ?? string.Empty, DbType.String);
        parameters.Add("@Status", entity.Status, DbType.Decimal);
        parameters.Add("@TransMode", entity.TransMode, DbType.Decimal);
        parameters.Add("@RefType", entity.RefType, DbType.Decimal);
        parameters.Add("@RefId", entity.RefId, DbType.Decimal);
        parameters.Add("@RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "Proc_Insert_CummulativeChargePayTrans",
            parameters,
            transaction,
            commandType: CommandType.StoredProcedure);

        entity.CummulativeChargePayTransId = parameters.Get<decimal>("@RecordId");
    }
}
