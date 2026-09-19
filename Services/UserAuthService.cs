using System.Data;
using Dapper;
using eAccountNoteService.Models;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Services;

public class UserAuthService
{
    private readonly DapperService _dapperService;
    private readonly TokenService _tokenService;
    private readonly ILogger<UserAuthService> _logger;

    public UserAuthService(DapperService dapperService, TokenService tokenService, ILogger<UserAuthService> logger)
    {
        _dapperService = dapperService;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<ServerResponse> AuthorizeMeAsync(string loginId, string password)
    {
        try
        {
            var accessKey = Guid.NewGuid().ToString("N");

            var parameters = new DynamicParameters();
            parameters.Add("LoginId", loginId, DbType.String, ParameterDirection.Input);
            parameters.Add("ePassword", password, DbType.String, ParameterDirection.Input);
            parameters.Add("AccessKey", accessKey, DbType.String, ParameterDirection.Input);
            parameters.Add("OperStatus", dbType: DbType.Int16, direction: ParameterDirection.Output);

            await _dapperService.ExecuteStoredProcedureAsync("Proc_Authenticate_User", parameters);

            var operStatus = parameters.Get<short>("OperStatus");
            if (operStatus == 0)
            {
                return new ServerResponse { IsSuccess = false, Error = "Not Authenticated" };
            }

            // Query base user details only (no org / profile details)
            const string sql = @"
                SELECT UserId, LoginId, EmailId, MobileNo, UserName, AddedDt, AccessKey
                FROM UserMaster
                WHERE LoginId = @LoginId";

            var user = await _dapperService.QueryFirstOrDefaultAsync<UserMaster>(sql, new { LoginId = loginId });

            if (user == null)
            {
                return new ServerResponse { IsSuccess = false, Error = "Record not found" };
            }

            // Resolve highest role for the user across profiles (100: SuperAdmin, 1: Admin, 3: Auditor, 2: NormalUser)
            const string roleSql = @"
                SELECT TOP 1 UPR.RoleId
                FROM UserProfile UP
                INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
                WHERE UP.UserId = @UserId
                ORDER BY 
                    CASE 
                        WHEN UPR.RoleId = 100 THEN 1
                        WHEN UPR.RoleId = 1 THEN 2
                        WHEN UPR.RoleId = 3 THEN 3
                        WHEN UPR.RoleId = 2 THEN 4
                        ELSE 5 
                    END ASC";

            var userRoleId = await _dapperService.QuerySingleOrDefaultAsync<decimal?>(roleSql, new { UserId = user.UserId });
            user.RoleId = userRoleId ?? 2;

            if (Utility.AppConstants.useBearerToken)
            {
                user.AccessKey = _tokenService.GenerateToken(user.UserId, 0, user.RoleId);
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

    public async Task<ServerResponse> GetUserOrgProfileAsync(decimal userId, decimal orgId)
    {
        if (userId <= 0 || orgId <= 0)
        {
            return new ServerResponse
            {
                IsSuccess = false,
                Error = "Valid UserId and OrgId are required."
            };
        }

        try
        {
            // Check if user is Super Admin
            const string checkSuperAdminSql = @"
                SELECT TOP 1 1
                FROM UserProfile UP
                INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
                WHERE UP.UserId = @UserId AND UPR.RoleId = 100";

            var isSuperAdmin = (await _dapperService.QuerySingleOrDefaultAsync<int?>(checkSuperAdminSql, new { UserId = userId })) == 1;

            if (isSuperAdmin)
            {
                // Create Super Admin association with selected org if it doesn't already exist
                const string ensureSuperProfileSql = @"
                    IF NOT EXISTS (SELECT 1 FROM UserProfile WHERE UserId = @UserId AND OrgId = @OrgId)
                    BEGIN
                        INSERT INTO UserProfile (UserId, OrgId)
                        VALUES (@UserId, @OrgId);

                        DECLARE @NewProfileId NUMERIC = SCOPE_IDENTITY();

                        INSERT INTO UserProfileRole (UserProfileId, RoleId)
                        VALUES (@NewProfileId, 100);
                    END
                    ELSE IF NOT EXISTS (
                        SELECT 1 
                        FROM UserProfile UP 
                        INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId 
                        WHERE UP.UserId = @UserId AND UP.OrgId = @OrgId AND UPR.RoleId = 100
                    )
                    BEGIN
                        INSERT INTO UserProfileRole (UserProfileId, RoleId)
                        SELECT UP.ProfileId, 100
                        FROM UserProfile UP
                        WHERE UP.UserId = @UserId AND UP.OrgId = @OrgId;
                    END";

                await _dapperService.ExecuteAsync(ensureSuperProfileSql, new { UserId = userId, OrgId = orgId });
            }

            const string sql = @"
                SELECT 
                    UM.UserId, UM.LoginId, UM.EmailId, UM.MobileNo, UM.UserName, UM.AddedDt, UM.AccessKey,
                    UP.OrgId, UP.ProfileId, OM.OrgName, OM.Address, 
                    ISNULL(UPR.RoleId, 2) AS RoleId,
                    OM.MonthlyMaintItem AS MonthlyMaintItemName, 
                    OM.CutOffWeightInTransToken, 
                    OM.DefaultBankForBillPay AS DefaultBankName,
                    OM.AllowChargePayment,
                    OM.AllowAdvancePayment
                FROM UserMaster UM
                INNER JOIN UserProfile UP ON UM.UserId = UP.UserId
                INNER JOIN OrgMaster OM ON UP.OrgId = OM.OrgId
                LEFT JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
                WHERE UM.UserId = @UserId AND UP.OrgId = @OrgId
                ORDER BY 
                    CASE 
                        WHEN UPR.RoleId = 100 THEN 1
                        WHEN UPR.RoleId = 1 THEN 2
                        WHEN UPR.RoleId = 3 THEN 3
                        WHEN UPR.RoleId = 2 THEN 4
                        ELSE 5 
                    END ASC";

            var user = await _dapperService.QueryFirstOrDefaultAsync<UserMaster>(sql, new { 
                UserId = userId, 
                OrgId = orgId 
            });

            if (user == null)
            {
                return new ServerResponse { IsSuccess = false, Error = "User organization profile not found." };
            }

            if (Utility.AppConstants.useBearerToken)
            {
                user.AccessKey = _tokenService.GenerateToken(user.UserId, user.OrgId, user.RoleId);
            }

            return new ServerResponse
            {
                IsSuccess = true,
                Data = user
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user org profile for UserId {UserId}, OrgId {OrgId}", userId, orgId);
            return new ServerResponse
            {
                IsSuccess = false,
                Error = ex.Message
            };
        }
    }
}
