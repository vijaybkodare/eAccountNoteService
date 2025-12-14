using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class UserProfileService
{
    private readonly DapperService _dapperService;

    public UserProfileService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task InsertAsync(UserProfile entity, IDbConnection connection, IDbTransaction transaction)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", entity.UserId, DbType.Decimal);
        parameters.Add("OrgId", entity.OrgId, DbType.Decimal);
        parameters.Add("RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);

        await connection.ExecuteAsync("Proc_Insert_UserProfile", parameters, transaction, commandType: CommandType.StoredProcedure);

        entity.ProfileId = parameters.Get<decimal>("RecordId");
    }
}
