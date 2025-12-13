using System.Data;
using Dapper;
using eAccountNoteService.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Services;

public class UserAuthService
{
    private readonly string _connectionString;
    private readonly ILogger<UserAuthService> _logger;

    public UserAuthService(IConfiguration configuration, ILogger<UserAuthService> logger)
    {
        _logger = logger;
        _connectionString = configuration.GetConnectionString("DefaultConnection")
                         ?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found");
    }

    public async Task<ServerResponse> AuthorizeMeAsync(string loginId, string password)
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            // Generate a new access key similar to legacy Common.GetAccessKey
            var accessKey = Guid.NewGuid().ToString("N");

            var parameters = new DynamicParameters();
            parameters.Add("LoginId", loginId, DbType.String, ParameterDirection.Input);
            parameters.Add("ePassword", password, DbType.String, ParameterDirection.Input);
            parameters.Add("AccessKey", accessKey, DbType.String, ParameterDirection.Input);
            parameters.Add("OperStatus", dbType: DbType.Int16, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("Proc_Authenticate_User", parameters, commandType: CommandType.StoredProcedure);

            var operStatus = parameters.Get<short>("OperStatus");
            if (operStatus == 0)
            {
                return new ServerResponse { IsSuccess = false, Error = "Not Authenticated" };
            }

            // Fetch user details (similar to legacy getUserDetails)
            const string sql = @"SELECT UM.*, UP.OrgId, UP.ProfileId, OM.OrgName, OM.Address, UPR.RoleId
FROM UserMaster UM
INNER JOIN UserProfile UP ON UM.UserId = UP.UserId
INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
INNER JOIN OrgMaster OM ON UP.OrgId = OM.OrgId
WHERE UM.LoginId = @LoginId";

            var user = await connection.QuerySingleOrDefaultAsync<UserMaster>(sql, new { LoginId = loginId });
            if (user == null)
            {
                return new ServerResponse { IsSuccess = false, Error = "Record not found" };
            }

            return new ServerResponse
            {
                IsSuccess = true,
                Data = user
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user authorization for LoginId {LoginId}", loginId);
            return new ServerResponse
            {
                IsSuccess = false,
                Error = ex.Message
            };
        }
    }
}
