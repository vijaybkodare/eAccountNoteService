using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class ItemMasterService
{
    private readonly DapperService _dapperService;

    public ItemMasterService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<ItemMaster>> GetRecordsAsync(int orgId)
    {
        const string sql = @"SELECT IM.ItemId, IM.OrgId, IM.ItemName, IM.AccountId, IM.Active, AM.AccountName
                             FROM ItemMaster IM
                             INNER JOIN AccountMaster AM ON IM.AccountId = AM.AccountId
                             WHERE IM.OrgId = @OrgId
                             ORDER BY IM.ItemName";

        return await _dapperService.QueryAsync<ItemMaster>(sql, new { OrgId = orgId });
    }

    public async Task<ItemMaster?> GetRecordByIdAsync(int itemId)
    {
        const string sql = @"SELECT IM.ItemId, IM.OrgId, IM.ItemName, IM.AccountId, IM.Active, AM.AccountName
                             FROM ItemMaster IM
                             INNER JOIN AccountMaster AM ON IM.AccountId = AM.AccountId
                             WHERE IM.ItemId = @ItemId";

        return await _dapperService.QuerySingleOrDefaultAsync<ItemMaster>(sql, new { ItemId = itemId });
    }

    public async Task<bool> AddUpdateAsync(ItemMaster entity)
    {
        if (entity.ItemId == -1)
        {
            return await AddRecordAsync(entity);
        }
        else
        {
            return await UpdateRecAsync(entity);
        }
    }

    private async Task<bool> AddRecordAsync(ItemMaster entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("OrgId", entity.OrgId, DbType.Int32);
        parameters.Add("ItemName", entity.ItemName, DbType.String);
        parameters.Add("AccountId", entity.AccountId, DbType.Int32);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_ItemMaster", parameters);
        return true;
    }

    private async Task<bool> UpdateRecAsync(ItemMaster entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("ItemId", entity.ItemId, DbType.Int32);
        parameters.Add("ItemName", entity.ItemName, DbType.String);
        parameters.Add("AccountId", entity.AccountId, DbType.Int32);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Update_ItemMaster", parameters);
        return true;
    }

    public async Task<bool> DeleteRecAsync(decimal recId)
    {
        // Ensure item is not used in ChargeOrder
        const string checkChargeSql = "SELECT COUNT(ItemId) FROM ChargeOrder WHERE ItemId = @ItemId";
        var chargeCount = await _dapperService.QuerySingleOrDefaultAsync<int>(checkChargeSql, new { ItemId = recId });
        if (chargeCount > 0)
        {
            return false;
        }

        // Ensure item is not used in BillOrder
        const string checkBillSql = "SELECT COUNT(ItemId) FROM BillOrder WHERE ItemId = @ItemId";
        var billCount = await _dapperService.QuerySingleOrDefaultAsync<int>(checkBillSql, new { ItemId = recId });
        if (billCount > 0)
        {
            return false;
        }

        const string deleteSql = "DELETE FROM ItemMaster WHERE ItemId = @ItemId";
        var rows = await _dapperService.ExecuteAsync(deleteSql, new { ItemId = recId });
        return rows > 0;
    }
}
