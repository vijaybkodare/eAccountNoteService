using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class BankStatementHeaderService
{
    private readonly DapperService _dapperService;
    private readonly BankStatementService _bankStatementService;

    public BankStatementHeaderService(DapperService dapperService, BankStatementService bankStatementService)
    {
        _dapperService = dapperService;
        _bankStatementService = bankStatementService;
    }

    public async Task<BankStatementHeader> GetRecordAsync(decimal id, decimal orgId)
    {
        const string sql = @"SELECT * FROM BankStatementHeader WHERE BankStatementHeaderId = @Id";

        var header = await _dapperService.QuerySingleOrDefaultAsync<BankStatementHeader>(sql, new { Id = id });
        if (header == null)
        {
            header = new BankStatementHeader
            {
                BankStatementHeaderId = -1,
                OrgId = (int)orgId,
                BankStatementNo = await GetOrderNoAsync(orgId),
                AddedDt = DateTime.Now
            };
        }
        else
        {
            var details = await _bankStatementService.GetRecordsAsync(id, -1, null, null, -1, null);
            header.Details = details;
        }

        return header;
    }

    public async Task<IEnumerable<BankStatementHeader>> GetRecordsAsync(decimal orgId)
    {
        const string sql = @"SELECT * FROM BankStatementHeader WHERE OrgId = @OrgId";
        return await _dapperService.QueryAsync<BankStatementHeader>(sql, new { OrgId = orgId });
    }

    private async Task<string> GetOrderNoAsync(decimal orgId)
    {
        const string sql = @"SELECT TOP 1 BankStatementNo
+                             FROM BankStatementHeader
+                             WHERE OrgId = @OrgId
+                             ORDER BY BankStatementHeaderId DESC";

        var lastNo = await _dapperService.QuerySingleOrDefaultAsync<string>(sql, new { OrgId = orgId });
        if (string.IsNullOrWhiteSpace(lastNo))
        {
            lastNo = "BNKST000";
        }

        var numericPart = 0m;
        if (lastNo.Length > 5)
        {
            decimal.TryParse(lastNo.Substring(5), out numericPart);
        }

        var nextNo = numericPart + 1;
        return $"BNKST{nextNo:000}";
    }
}
