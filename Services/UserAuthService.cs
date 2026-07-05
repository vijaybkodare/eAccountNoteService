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
            // Generate a new access key similar to legacy Common.GetAccessKey
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

            // Fetch user details including organization settings
            const string sql = @"SELECT UM.*, UP.OrgId, UP.ProfileId, OM.OrgName, OM.Address, UPR.RoleId,
                                       OM.MonthlyMaintItem AS MonthlyMaintItemName, 
                                       OM.CutOffWeightInTransToken, 
                                       OM.DefaultBankForBillPay AS DefaultBankName,
                                       OM.AllowChargePayment,
                                       OM.AllowAdvancePayment
            FROM UserMaster UM
            INNER JOIN UserProfile UP ON UM.UserId = UP.UserId
            INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
            INNER JOIN OrgMaster OM ON UP.OrgId = OM.OrgId
            WHERE UM.LoginId = @LoginId";

            var user = await _dapperService.QuerySingleOrDefaultAsync<UserMaster>(sql, new { LoginId = loginId });

            if (user == null)
            {
                return new ServerResponse { IsSuccess = false, Error = "Record not found" };
            }

            if (Utility.AppConstants.useBearerToken)
            {
                user.AccessKey = _tokenService.GenerateToken(user.UserId, user.OrgId, user.RoleId);
            }

            // Fetch ItemMaster for MonthlyMaintItem
            if (!string.IsNullOrEmpty(user.MonthlyMaintItemName))
            {
                const string itemSql = "SELECT * FROM ItemMaster WHERE ItemName = @ItemName AND OrgId = @OrgId";
                user.MonthlyMaintItem = await _dapperService.QuerySingleOrDefaultAsync<ItemMaster>(itemSql, new { ItemName = user.MonthlyMaintItemName, OrgId = user.OrgId });
            }

            // Fetch AccountMaster for DefaultBankForBillPay
            if (!string.IsNullOrEmpty(user.DefaultBankName))
            {
                const string accountSql = "SELECT * FROM AccountMaster WHERE AccountName = @AccountName AND OrgId = @OrgId";
                user.DefaultBankForBillPay = await _dapperService.QuerySingleOrDefaultAsync<AccountMaster>(accountSql, new { AccountName = user.DefaultBankName, OrgId = user.OrgId });
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
