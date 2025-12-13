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
+                    FROM CummulativeChargePayTrans CCPT
+                    INNER JOIN AccountMaster AM1 ON AM1.AccountId = CCPT.DrAccountId
+                    INNER JOIN AccountMaster AM2 ON AM2.AccountId = CCPT.CrAccountId
+                    WHERE CCPT.OrgId = @OrgId AND CCPT.Status = 0";

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
}
