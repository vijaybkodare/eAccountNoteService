using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class AccountTransTokenService
{
    private readonly DapperService _dapperService;

    public AccountTransTokenService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<bool> AddRecordAsync(AccountTransToken entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@AccountId", entity.AccountId, DbType.Decimal);
        parameters.Add("@TokenTypeId", entity.TokenTypeId, DbType.Decimal);
        parameters.Add("@TokenValue", entity.TokenValue ?? string.Empty, DbType.String);
        parameters.Add("@TokenWeight", entity.TokenWeight, DbType.Decimal);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_AccountTransToken", parameters);
        return true;
    }

    public async Task<IEnumerable<AccountTransToken>> GetTransTokensAsync(decimal orgId, decimal accountId)
    {
        var sql = @"SELECT ATT.AccountId, ATT.TokenTypeId, ATT.TokenValue, ATT.TokenWeight, TTM.TokenName
                    FROM AccountTransToken ATT
                    INNER JOIN AccountMaster AM ON ATT.AccountId = AM.AccountId
                    INNER JOIN TransTokenMaster TTM ON ATT.TokenTypeId = TTM.TokenTypeId
                    WHERE 1 = 1";

        var parameters = new DynamicParameters();

        if (orgId != -1)
        {
            sql += " AND AM.OrgId = @OrgId";
            parameters.Add("@OrgId", orgId, DbType.Decimal);
        }
        if (accountId != -1)
        {
            sql += " AND AM.AccountId = @AccountId";
            parameters.Add("@AccountId", accountId, DbType.Decimal);
        }

        return await _dapperService.QueryAsync<AccountTransToken>(sql, parameters);
    }

    public async Task<IEnumerable<AccountTransToken>> GetTransTokenTypesAsync()
    {
        const string sql = "SELECT * FROM TransTokenMaster";
        return await _dapperService.QueryAsync<AccountTransToken>(sql);
        /*return rows.Select(r => new AccountTransToken
        {
            TokenTypeId = (int)r.TokenTypeId,
            TokenName = (string)r.TokenName,
            TokenValue = string.Empty,
            TokenWeight = 0
        }).ToList();*/
    }

    public async Task<bool> DeleteAsync(decimal accountId, int tokenTypeId)
    {
        const string sql = @"DELETE FROM AccountTransToken
                             WHERE AccountId = @AccountId AND TokenTypeId = @TokenTypeId";

        var affected = await _dapperService.ExecuteAsync(sql, new { AccountId = accountId, TokenTypeId = tokenTypeId });
        return affected > 0;
    }
}
