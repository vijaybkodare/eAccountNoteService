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
}
