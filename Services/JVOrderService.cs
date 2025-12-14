using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class JVOrderService
{
    private readonly DapperService _dapperService;

    public JVOrderService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<JVOrder>> GetRecordsAsync(decimal orgId)
    {
        const string sql = @"SELECT JVO.JVOrderId, JVO.OrgId, JVO.JVOrderNo, JVO.AddedDt,
                                   JVO.DrAccountId, JVO.CrAccountId, JVO.Amount, JVO.Remark,
                                   AM1.AccountName AS DrAccount, AM2.AccountName AS CrAccount
                            FROM JVOrder JVO
                            INNER JOIN AccountMaster AM1 ON AM1.AccountId = JVO.DrAccountId
                            INNER JOIN AccountMaster AM2 ON AM2.AccountId = JVO.CrAccountId
                            WHERE JVO.OrgId = @OrgId
                            ORDER BY JVO.JVOrderNo";

        return await _dapperService.QueryAsync<JVOrder>(sql, new { OrgId = orgId });
    }

    public async Task<JVOrder> GetRecordAsync(decimal orgId)
    {
        var entity = new JVOrder
        {
            OrgId = (int)orgId,
            JVOrderNo = await GetOrderNoAsync(orgId),
            AddedDt = DateTime.Now
        };
        return entity;
    }

    public async Task<(bool Success, string ErrorMessage)> AddAsync(JVOrder entity)
    {
        try
        {
            entity.JVOrderNo = await GetOrderNoAsync(entity.OrgId);

            var parameters = new DynamicParameters();
            parameters.Add("@RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);
            parameters.Add("@JVOrderNo", entity.JVOrderNo, DbType.String);
            parameters.Add("@OrgId", entity.OrgId, DbType.Int32);
            parameters.Add("@DrAccountId", entity.DrAccountId, DbType.Decimal);
            parameters.Add("@CrAccountId", entity.CrAccountId, DbType.Decimal);
            parameters.Add("@Amount", entity.Amount, DbType.Decimal);
            parameters.Add("@Remark", entity.Remark ?? string.Empty, DbType.String);

            await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_JVOrder", parameters);

            entity.JVOrderId = parameters.Get<decimal>("@RecordId");
            return (true, string.Empty);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    private async Task<string> GetOrderNoAsync(decimal orgId)
    {
        const string sql = @"SELECT TOP 1 JVOrderNo
                             FROM JVOrder
                             WHERE OrgId = @OrgId
                             ORDER BY JVOrderId DESC";

        var lastNo = await _dapperService.QuerySingleOrDefaultAsync<string>(sql, new { OrgId = orgId });
        if (string.IsNullOrWhiteSpace(lastNo))
        {
            lastNo = "JV000";
        }

        var numericPart = 0m;
        if (lastNo.Length > 2)
        {
            decimal.TryParse(lastNo.Substring(2), out numericPart);
        }

        var nextNo = numericPart + 1;
        return $"JV{nextNo:000}";
    }
}
