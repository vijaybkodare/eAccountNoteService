using System.Data;
using Dapper;
using eAccountNoteService.Models;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Services;

public class AppInitService
{
    private readonly DapperService _dapperService;
    private readonly ILogger<AppInitService> _logger;

    public AppInitService(DapperService dapperService, ILogger<AppInitService> logger)
    {
        _dapperService = dapperService;
        _logger = logger;
    }

    public async Task<bool> IsAppInitiatedAsync()
    {
        const string checkSql = @"SELECT 
            (SELECT COUNT(1) FROM OrgMaster) AS OrgCount, 
            (SELECT COUNT(1) FROM UserMaster) AS UserCount";

        var counts = await _dapperService.QuerySingleOrDefaultAsync<dynamic>(checkSql);
        if (counts != null)
        {
            int orgCount = Convert.ToInt32(counts.OrgCount ?? 0);
            int userCount = Convert.ToInt32(counts.UserCount ?? 0);
            return orgCount > 0 || userCount > 0;
        }

        return false;
    }

    public async Task<ServerResponse> InitiateAppAsync(InitiateAppRequest request)
    {
        if (request == null)
        {
            return new ServerResponse
            {
                IsSuccess = false,
                Error = "Request payload is required."
            };
        }

        if (string.IsNullOrWhiteSpace(request.OrgName))
        {
            return new ServerResponse
            {
                IsSuccess = false,
                Error = "Organization name is required."
            };
        }

        if (string.IsNullOrWhiteSpace(request.LoginId))
        {
            return new ServerResponse
            {
                IsSuccess = false,
                Error = "Login ID is required."
            };
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return new ServerResponse
            {
                IsSuccess = false,
                Error = "Password is required."
            };
        }

        if (string.IsNullOrWhiteSpace(request.UserName))
        {
            return new ServerResponse
            {
                IsSuccess = false,
                Error = "User name is required."
            };
        }

        if (await IsAppInitiatedAsync())
        {
            _logger.LogWarning("App initiation rejected: Org or User already exists.");
            return new ServerResponse
            {
                IsSuccess = false,
                Error = "App is already initiated"
            };
        }

        try
        {
            return await _dapperService.ExecuteInTransactionAsync<ServerResponse>(async (connection, transaction) =>
            {
                // Concurrency safety check inside transaction
                const string checkInsideSql = @"SELECT 
                    (SELECT COUNT(1) FROM OrgMaster) AS OrgCount, 
                    (SELECT COUNT(1) FROM UserMaster) AS UserCount";

                var innerCounts = await connection.QuerySingleOrDefaultAsync<dynamic>(checkInsideSql, transaction: transaction);
                if (innerCounts != null)
                {
                    int orgCount = Convert.ToInt32(innerCounts.OrgCount ?? 0);
                    int userCount = Convert.ToInt32(innerCounts.UserCount ?? 0);
                    if (orgCount > 0 || userCount > 0)
                    {
                        return new ServerResponse
                        {
                            IsSuccess = false,
                            Error = "App is already initiated"
                        };
                    }
                }

                // 1. Create Organization via Proc_Insert_OrgMaster
                var orgParams = new DynamicParameters();
                orgParams.Add("OrgName", request.OrgName.Trim(), DbType.String);
                orgParams.Add("Address", request.Address?.Trim() ?? string.Empty, DbType.String);
                orgParams.Add("RecordId", dbType: DbType.Int16, direction: ParameterDirection.Output);

                await connection.ExecuteAsync("Proc_Insert_OrgMaster", orgParams, transaction, commandType: CommandType.StoredProcedure);
                short orgId = orgParams.Get<short>("RecordId");

                // 2. Create 1st User via Proc_Create_User
                var userParams = new DynamicParameters();
                userParams.Add("OrgId", orgId, DbType.Int16);
                userParams.Add("LoginId", request.LoginId.Trim(), DbType.String);
                userParams.Add("Password", request.Password.Trim(), DbType.String);
                userParams.Add("EmailId", request.EmailId?.Trim() ?? string.Empty, DbType.String);
                userParams.Add("MobileNo", request.MobileNo?.Trim() ?? string.Empty, DbType.String);
                userParams.Add("UserName", request.UserName.Trim(), DbType.String);
                userParams.Add("RoleId", request.RoleId, DbType.Byte);
                userParams.Add("AccountId", request.AccountId, DbType.Decimal);

                await connection.ExecuteAsync("Proc_Create_User", userParams, transaction, commandType: CommandType.StoredProcedure);

                _logger.LogInformation("App successfully initiated with OrgId: {OrgId} and LoginId: {LoginId}", orgId, request.LoginId);

                return new ServerResponse
                {
                    IsSuccess = true,
                    Data = new
                    {
                        OrgId = orgId,
                        OrgName = request.OrgName.Trim(),
                        LoginId = request.LoginId.Trim(),
                        UserName = request.UserName.Trim()
                    }
                };
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initiate app.");
            return new ServerResponse
            {
                IsSuccess = false,
                Error = ex.Message
            };
        }
    }
}
