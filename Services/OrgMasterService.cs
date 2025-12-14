using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class OrgMasterService
{
    private readonly DapperService _dapperService;

    public OrgMasterService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<IEnumerable<OrgMaster>> GetRecordsAsync()
    {
        const string sql = @"SELECT OrgId, OrgName, Address
                               FROM OrgMaster";

        var list = await _dapperService.QueryAsync<OrgMaster>(sql);
        return list;
    }

    public async Task<OrgMaster?> GetRecordAsync(int orgId)
    {
        const string sql = @"SELECT OrgId, OrgName, Address
                               FROM OrgMaster
                               WHERE OrgId = @OrgId";

        return await _dapperService.QuerySingleOrDefaultAsync<OrgMaster>(sql, new { OrgId = orgId });
    }

    public async Task<OrgMaster> SaveRecordAsync(OrgMaster entity)
    {
        if (entity.OrgId == 0)
        {
            await InsertAsync(entity);
        }
        else
        {
            await UpdateAsync(entity);
        }
        return entity;
    }

    public async Task<bool> DeleteRecordAsync(int orgId)
    {
        const string sql = "DELETE FROM OrgMaster WHERE OrgId = @OrgId";
        var rows = await _dapperService.ExecuteAsync(sql, new { OrgId = orgId });
        return rows > 0;
    }

    private async Task InsertAsync(OrgMaster entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@OrgName", entity.OrgName);
        parameters.Add("@Address", entity.Address);
        parameters.Add("@RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Insert_OrgMaster", parameters);

        entity.OrgId = parameters.Get<decimal>("@RecordId");
    }

    public async Task InsertAsync(OrgMaster entity, IDbConnection connection, IDbTransaction transaction)
    {
        var parameters = new DynamicParameters();
        parameters.Add("OrgName", entity.OrgName);
        parameters.Add("Address", entity.Address);
        parameters.Add("RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);

        await connection.ExecuteAsync("Proc_Insert_OrgMaster", parameters, transaction, commandType: CommandType.StoredProcedure);

        entity.OrgId = parameters.Get<decimal>("RecordId");
    }

    private async Task UpdateAsync(OrgMaster entity)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@OrgId", entity.OrgId, DbType.Decimal);
        parameters.Add("@OrgName", entity.OrgName);
        parameters.Add("@Address", entity.Address);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Update_OrgMaster", parameters);
    }
}
