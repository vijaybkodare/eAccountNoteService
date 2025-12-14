using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class AccountMasterService
{
    private readonly DapperService _dapperService;

    public AccountMasterService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<AccountMaster>> GetRecordsAsync(int orgId)
    {
        const string sql = @"SELECT OrgId, AccountId, AccountType, AccountName, Amount, Active
                              FROM AccountMaster
                              WHERE OrgId = @OrgId
                              ORDER BY AccountName";

        return await _dapperService.QueryAsync<AccountMaster>(sql, new { OrgId = orgId });
    }

    public async Task<AccountMaster?> GetRecordAsync(decimal accountId)
    {
        const string sql = @"SELECT OrgId, AccountId, AccountType, AccountName, Amount, Active
                              FROM AccountMaster
                              WHERE AccountId = @AccountId";

        return await _dapperService.QuerySingleOrDefaultAsync<AccountMaster>(sql, new { AccountId = accountId });
    }

    public async Task<AccountSummary> GetAccountSummaryAsync(int orgId)
    {
        var summary = new AccountSummary();

        const string pendingChargesSql = @"SELECT SUM(Amount - PaidAmount) AS TotalPending FROM ChargeOrder WHERE OrgId = @OrgId";
        const string pendingBillsSql = @"SELECT SUM(Amount - PaidAmount) AS TotalPending FROM BillOrder WHERE OrgId = @OrgId";
        const string balanceSql = @"SELECT SUM(Amount) AS Total FROM AccountMaster WHERE (AccountType = 2 OR AccountType = 3) AND OrgId = @OrgId";

        summary.PendingCharges = await _dapperService.QuerySingleOrDefaultAsync<decimal>(pendingChargesSql, new { OrgId = orgId });
        summary.PendingBills = await _dapperService.QuerySingleOrDefaultAsync<decimal>(pendingBillsSql, new { OrgId = orgId });
        summary.Balance = await _dapperService.QuerySingleOrDefaultAsync<decimal>(balanceSql, new { OrgId = orgId });

        return summary;
    }

    public async Task<bool> AddUpdateAsync(AccountMaster entity)
    {
        if (entity.AccountId == -1)
        {
            return await AddRecAsync(entity);
        }
        else
        {
            return await UpdateRecAsync(entity);
        }
    }

    private async Task<bool> AddRecAsync(AccountMaster entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", entity.OrgId, DbType.Int16);
        parameters.Add("@AccountType", entity.AccountType, DbType.Int16);
        parameters.Add("@AccountName", entity.AccountName, DbType.String);

        var rows = await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_AccountMaster", parameters);
        return rows > 0;
    }

    private async Task<bool> UpdateRecAsync(AccountMaster entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@AccountId", entity.AccountId, DbType.Decimal);
        parameters.Add("@AccountType", entity.AccountType, DbType.Int16);
        parameters.Add("@AccountName", entity.AccountName, DbType.String);

        var rows = await _dapperService.ExecuteStoredProcedureAsync("Proc_Update_AccountMaster", parameters);
        return rows > 0;
    }

    public async Task<bool> DeleteRecAsync(decimal accountId)
    {
        // Check related records like legacy DeleteRec
        var itemCount = await _dapperService.QuerySingleOrDefaultAsync<int>(
            "SELECT COUNT(AccountId) FROM ItemMaster WHERE AccountId = @AccountId",
            new { AccountId = accountId });
        if (itemCount > 0) return false;

        var chargeOrderCount = await _dapperService.QuerySingleOrDefaultAsync<int>(
            "SELECT COUNT(AccountId) FROM ChargeOrder WHERE AccountId = @AccountId",
            new { AccountId = accountId });
        if (chargeOrderCount > 0) return false;

        var payeeDetailCount = await _dapperService.QuerySingleOrDefaultAsync<int>(
            "SELECT COUNT(AccountId) FROM ChargePayeeDetail WHERE AccountId = @AccountId",
            new { AccountId = accountId });
        if (payeeDetailCount > 0) return false;

        var billOrderCount = await _dapperService.QuerySingleOrDefaultAsync<int>(
            "SELECT COUNT(AccountId) FROM BillOrder WHERE AccountId = @AccountId OR BankAccountId = @AccountId",
            new { AccountId = accountId });
        if (billOrderCount > 0) return false;

        const string deleteSql = "DELETE FROM AccountMaster WHERE AccountId = @AccountId";
        var rows = await _dapperService.ExecuteAsync(deleteSql, new { AccountId = accountId });
        return rows > 0;
    }
}
