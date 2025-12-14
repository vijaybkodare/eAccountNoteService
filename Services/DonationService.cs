using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class DonationService
{
    private readonly DapperService _dapperService;

    public DonationService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<DonationHeader>> GetRecordsAsync(decimal orgId)
    {
        const string sql = @"SELECT DH.*, IM.ItemName, AM.AccountName
                             FROM DonationHeader DH
                             INNER JOIN ItemMaster IM ON IM.ItemId = DH.ItemId
                             INNER JOIN AccountMaster AM ON AM.AccountId = DH.AccountId
                             WHERE DH.OrgId = @OrgId";

        return await _dapperService.QueryAsync<DonationHeader>(sql, new { OrgId = orgId });
    }

    public async Task<IEnumerable<DonationDetail>> GetDetailRecordsAsync(decimal orgId, decimal donationHeaderId)
    {
        const string sql = @"SELECT DH.DonationNo,
                                    DH.Remark AS HeaderRemark,
                                    DD.PaymentDt,
                                    DD.Remark,
                                    DD.Amount,
                                    DD.TransactionId,
                                    AMDr.AccountName AS DrAccount,
                                    AMCr.AccountName AS CrAccount,
                                    IM.ItemName
                             FROM DonationDetail DD
                             INNER JOIN AccountMaster AMDr ON DD.DrAccountId = AMDr.AccountId
                             INNER JOIN AccountMaster AMCr ON DD.CrAccountId = AMCr.AccountId
                             INNER JOIN DonationHeader DH ON DD.DonationHeaderId = DH.DonationHeaderId
                             INNER JOIN ItemMaster IM ON IM.ItemId = DH.ItemId
                             WHERE DD.DonationHeaderId = @DonationHeaderId";

        var parameters = new DynamicParameters();
        parameters.Add("@DonationHeaderId", donationHeaderId, DbType.Decimal);

        return await _dapperService.QueryAsync<DonationDetail>(sql, parameters);
    }

    public async Task<DonationHeader> GetRecordAsync(decimal id, decimal orgId)
    {
        const string sql = @"SELECT DH.*, IM.ItemName, AM.AccountName
                             FROM DonationHeader DH
                             INNER JOIN ItemMaster IM ON IM.ItemId = DH.ItemId
                             INNER JOIN AccountMaster AM ON AM.AccountId = DH.AccountId
                             WHERE DH.DonationHeaderId = @Id";

        var header = await _dapperService.QuerySingleOrDefaultAsync<DonationHeader>(sql, new { Id = id });
        if (header == null)
        {
            header = new DonationHeader
            {
                DonationHeaderId = -1,
                OrgId = orgId,
                DonationNo = await GetOrderNoAsync(orgId),
                DonationDt = DateTime.Now
            };
        }
        // If needed, details can be loaded separately via GetDetailRecordsAsync.

        return header;
    }

    public async Task<bool> AddOrUpdateAsync(DonationHeader entity)
    {
        if (entity.DonationHeaderId == -1)
        {
            return await AddDonationHeaderAsync(entity);
        }
        else
        {
            return await UpdateDonationHeaderAsync(entity);
        }
    }

    public async Task<bool> AddDonationHeaderAsync(DonationHeader entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);
        parameters.Add("DonationNo", await GetOrderNoAsync(entity.OrgId), DbType.String);
        parameters.Add("OrgId", entity.OrgId, DbType.Decimal);
        parameters.Add("ItemId", entity.ItemId, DbType.Decimal);
        parameters.Add("AccountId", entity.AccountId, DbType.Decimal);
        parameters.Add("Remark", entity.Remark ?? string.Empty, DbType.String);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_DonationHeader", parameters);
        entity.DonationHeaderId = parameters.Get<decimal>("@RecordId");
        return true;
    }

    public async Task<bool> UpdateDonationHeaderAsync(DonationHeader entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("DonationHeaderId", entity.DonationHeaderId, DbType.Decimal);
        parameters.Add("ItemId", entity.ItemId, DbType.Decimal);
        parameters.Add("AccountId", entity.AccountId, DbType.Decimal);
        parameters.Add("Remark", entity.Remark ?? string.Empty, DbType.String);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Update_DonationHeader", parameters);
        return true;
    }

    public async Task<bool> AddDonationDetailAsync(DonationDetail entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);
        parameters.Add("DonationHeaderId", entity.DonationHeaderId, DbType.Decimal);
        parameters.Add("Amount", entity.Amount, DbType.Decimal);
        parameters.Add("Remark", entity.Remark ?? string.Empty, DbType.String);
        parameters.Add("TransMode", entity.TransMode, DbType.Decimal);
        parameters.Add("TransactionId", entity.TransactionId ?? string.Empty, DbType.String);
        parameters.Add("DrAccountId", entity.DrAccountId, DbType.Decimal);
        parameters.Add("CrAccountId", entity.CrAccountId, DbType.Decimal);
        parameters.Add("RefType", entity.RefType, DbType.Decimal);
        parameters.Add("RefId", entity.RefId, DbType.Decimal);
        parameters.Add("Status", entity.Status, DbType.Decimal);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_DonationDetail", parameters);
        entity.DonationDetailId = parameters.Get<decimal>("@RecordId");
        return true;
    }

    public async Task<bool> AddDonationTransAsync(DonationDetail entity)
    {
        const string sql = "SELECT AccountId FROM DonationHeader WHERE DonationHeaderId = @DonationHeaderId";
        entity.CrAccountId = await _dapperService.QuerySingleOrDefaultAsync<decimal>(sql, new { entity.DonationHeaderId });
        return await AddDonationDetailAsync(entity);
    }

    private async Task<string> GetOrderNoAsync(decimal orgId)
    {
        const string sql = @"SELECT TOP 1 DonationNo
                             FROM DonationHeader
                             WHERE OrgId = @OrgId
                             ORDER BY DonationHeaderId DESC";

        var lastNo = await _dapperService.QuerySingleOrDefaultAsync<string>(sql, new { OrgId = orgId });
        if (string.IsNullOrWhiteSpace(lastNo))
        {
            lastNo = "DN000";
        }

        decimal numericPart = 0;
        if (lastNo.Length > 2)
        {
            decimal.TryParse(lastNo.Substring(2), out numericPart);
        }

        var nextNo = numericPart + 1;
        return $"DN{nextNo:000}";
    }
}
