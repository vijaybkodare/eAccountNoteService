using System.Data;
using Dapper;
using eAccountNoteService.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Services;

public class UserService
{
    private readonly string _connectionString;
    private readonly ILogger<UserService> _logger;
    private readonly EmailSenderService _emailSender;
    private readonly Fast2SmsSender _smsSender;
    private readonly DapperService _dapperService;
    private readonly OrgMasterService _orgMasterService;
    private readonly UserProfileService _userProfileService;

    public UserService(
        IConfiguration configuration,
        ILogger<UserService> logger,
        EmailSenderService emailSender,
        Fast2SmsSender smsSender,
        DapperService dapperService,
        OrgMasterService orgMasterService,
        UserProfileService userProfileService)
    {
        _logger = logger;
        _emailSender = emailSender;
        _smsSender = smsSender;
        _dapperService = dapperService;
        _orgMasterService = orgMasterService;
        _userProfileService = userProfileService;
        _connectionString = configuration.GetConnectionString("DefaultConnection")
                         ?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found");
    }

    public async Task<bool> DeleteUserAsync(decimal userId)
    {
        const string sql1 = "DELETE FROM UserMaster WHERE UserId = @UserId";
        const string sql2 = "DELETE FROM UserProfile WHERE UserId = @UserId";
        const string sqlProfile = "SELECT TOP 1 ProfileId FROM UserProfile WHERE UserId = @UserId";
        const string sql3 = "DELETE FROM UserProfileRole WHERE UserProfileId = @ProfileId";
        try
        {
            return await _dapperService.ExecuteInTransactionAsync<bool>(async (connection, transaction) =>
            {
                await connection.ExecuteAsync(sql1, new { UserId = userId }, transaction);
                await connection.ExecuteAsync(sql2, new { UserId = userId }, transaction);

                var profileId = await connection.ExecuteScalarAsync<decimal?>(sqlProfile, new { UserId = userId }, transaction);
                if (profileId.HasValue)
                {
                    await connection.ExecuteAsync(sql3, new { ProfileId = profileId.Value }, transaction);
                }

                return true;
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", userId);
            return false;
        }
    }

    public async Task<ServerResponse> UpdatePasswordAsync(string loginId, string oldPassword, string newPassword)
    {
        try
        {
            await _dapperService.ExecuteInTransactionAsync<int>(async (connection, transaction) =>
            {
                var parameters = new DynamicParameters();
                parameters.Add("LoginId", loginId, DbType.String, ParameterDirection.Input);
                parameters.Add("NewPassword", newPassword, DbType.String, ParameterDirection.Input);
                parameters.Add("OldPassword", oldPassword, DbType.String, ParameterDirection.Input);

                await connection.ExecuteAsync("Proc_Update_Password", parameters, transaction, commandType: CommandType.StoredProcedure);
                return 0;
            });

            return new ServerResponse { IsSuccess = true };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating password for {LoginId}", loginId);
            return new ServerResponse { IsSuccess = false, Error = ex.Message };
        }
    }

    // Modern equivalent of legacy OrgController.save(UserMaster entity)
    public async Task<ServerResponse> SaveUserAndOrgAsync(UserMaster entity)
    {
        try
        {
            return await _dapperService.ExecuteInTransactionAsync<ServerResponse>(async (connection, transaction) =>
            {
                var newUser = entity.UserId == -1;

                // 1) Create or update UserMaster
                var password = await SaveUserMasterAsync(entity, connection, transaction);

                // 2) OrgMaster: only insert on new user, like legacy AddRec(iDBManager, OrgMaster)
                if (newUser)
                {
                    var org = new OrgMaster
                    {
                        OrgId = entity.OrgId,
                        OrgName = entity.OrgName,
                        Address = entity.Address
                    };

                    if (org.OrgId <= 0)
                    {
                        await _orgMasterService.InsertAsync(org, connection, transaction);
                        entity.OrgId = org.OrgId;
                    }
                }

                // 3) UserProfile: for new user only
                var userProfile = new UserProfile
                {
                    UserId = entity.UserId,
                    OrgId = entity.OrgId,
                    ProfileId = entity.ProfileId
                };

                if (newUser)
                {
                    await _userProfileService.InsertAsync(userProfile, connection, transaction);
                    entity.ProfileId = userProfile.ProfileId;
                }

                // 4) UserProfileRole: always insert like legacy code
                var userProfileRole = new UserProfileRole
                {
                    UserProfileId = userProfile.ProfileId,
                    RoleId = entity.RoleId
                };

                var roleParams = new DynamicParameters();
                roleParams.Add("RoleId", userProfileRole.RoleId, DbType.Decimal);
                roleParams.Add("UserProfileId", userProfileRole.UserProfileId, DbType.Decimal);

                await connection.ExecuteAsync("Proc_Insert_UserProfileRole", roleParams, transaction, commandType: CommandType.StoredProcedure);

                // 5) Send email for new user, inside transaction as in legacy code
                if (newUser && !string.IsNullOrEmpty(password))
                {
                    var emailSubject = $"Your eAccountNote password is {password}";
                    var emailBody = "eAccountNote";
                    var sent = _emailSender.SendEmail(entity.EmailId, emailSubject, emailBody);
                    if (!sent)
                    {
                        throw new Exception("Fail to sent an email.");
                    }
                }

                return new ServerResponse { IsSuccess = true };
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving user and org for {LoginId}", entity.LoginId);
            return new ServerResponse { IsSuccess = false, Error = ex.Message };
        }
    }

    private async Task<string?> SaveUserMasterAsync(UserMaster entity, IDbConnection connection, IDbTransaction transaction)
    {
        var newUser = entity.UserId == -1;
        string? password = null;

        if (newUser)
        {
            if (string.IsNullOrWhiteSpace(entity.Password))
            {
                password = GenRandomAlphanumericString(5);
                entity.Password = password;
            }
            else
            {
                password = entity.Password;
            }

            var userParams = new DynamicParameters();
            userParams.Add("LoginId", entity.LoginId, DbType.String);
            userParams.Add("EmailId", entity.EmailId, DbType.String);
            userParams.Add("MobileNo", entity.MobileNo, DbType.String);
            userParams.Add("UserName", entity.UserName, DbType.String);
            userParams.Add("Password", entity.Password, DbType.String);
            userParams.Add("RecordId", dbType: DbType.Decimal, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("Proc_Insert_UserMaster", userParams, transaction, commandType: CommandType.StoredProcedure);
            entity.UserId = userParams.Get<decimal>("RecordId");
        }
        else
        {
            var userParams = new DynamicParameters();
            userParams.Add("LoginId", entity.LoginId, DbType.String);
            userParams.Add("EmailId", entity.EmailId, DbType.String);
            userParams.Add("MobileNo", entity.MobileNo, DbType.String);
            userParams.Add("UserName", entity.UserName, DbType.String);
            userParams.Add("UserId", entity.UserId, DbType.Decimal);

            await connection.ExecuteAsync("Proc_Update_UserMaster", userParams, transaction, commandType: CommandType.StoredProcedure);
        }

        return password;
    }

    private async Task<bool> UpdatePasswordWithoutOldAsync(SqlConnection connection, SqlTransaction transaction, string loginId, string newPassword)
    {
        var parameters = new DynamicParameters();
        parameters.Add("LoginId", loginId, DbType.String, ParameterDirection.Input);
        parameters.Add("NewPassword", newPassword, DbType.String, ParameterDirection.Input);
        parameters.Add("OldPassword", dbType: DbType.String, direction: ParameterDirection.Input, value: null);

        await connection.ExecuteAsync("Proc_Update_Password", parameters, transaction, commandType: CommandType.StoredProcedure);
        return true;
    }

    public async Task<ServerResponse> ResetPasswordAsync(string loginId)
    {
        try
        {
            await _dapperService.ExecuteInTransactionAsync<int>(async (connection, transaction) =>
            {
                const string queryEmail = "SELECT EmailId FROM UserMaster WHERE LoginId = @LoginId";
                var emailId = await connection.ExecuteScalarAsync<string?>(queryEmail, new { LoginId = loginId }, transaction);
                if (string.IsNullOrEmpty(emailId))
                {
                    throw new Exception("User not found.");
                }

                var password = GenRandomAlphanumericString(5);
                await UpdatePasswordWithoutOldAsync((SqlConnection)connection, (SqlTransaction)transaction, loginId, password);

                var emailSubject = $"Your eAccountNote password is {password}";
                var emailBody = "eAccountNote";
                var sent = _emailSender.SendEmail(emailId, emailSubject, emailBody);
                if (!sent)
                {
                    throw new Exception("Fail to sent an email.");
                }

                return 0;
            });

            return new ServerResponse { IsSuccess = true };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting password for {LoginId}", loginId);
            return new ServerResponse { IsSuccess = false, Error = ex.Message };
        }
    }

    public async Task<IEnumerable<UserMaster>> GetUsersAsync(decimal orgId)
    {
        const string sql = @"SELECT UM.*, UP.OrgId, UP.ProfileId, OM.OrgName, OM.Address, UPR.RoleId
FROM UserMaster UM
INNER JOIN UserProfile UP ON UM.UserId = UP.UserId
INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
INNER JOIN OrgMaster OM ON UP.OrgId = OM.OrgId
WHERE UP.OrgId = @OrgId";

        return await _dapperService.QueryAsync<UserMaster>(sql, new { OrgId = orgId });
    }

    public async Task<IEnumerable<AccountMaster>> GetUserAccountsAsync(decimal profileId)
    {
        const string sql = @"SELECT AM.* FROM AccountMaster AM
INNER JOIN UserAccount UA ON UA.AccountId = AM.AccountId
WHERE UA.UserProfileId = @ProfileId";

        return await _dapperService.QueryAsync<AccountMaster>(sql, new { ProfileId = profileId });
    }

    public async Task<bool> AssignUserAccountAsync(UserMaster entity)
    {
        const string deleteSql = "DELETE FROM UserAccount WHERE UserProfileId = @ProfileId";
        const string insertSql = "INSERT INTO UserAccount(UserProfileId, AccountId) VALUES(@ProfileId, @AccountId)";

        try
        {
            return await _dapperService.ExecuteInTransactionAsync<bool>(async (connection, transaction) =>
            {
                await connection.ExecuteAsync(deleteSql, new { ProfileId = entity.ProfileId }, transaction);
                if (entity.Accounts != null)
                {
                    foreach (var account in entity.Accounts)
                    {
                        await connection.ExecuteAsync(insertSql,
                            new { ProfileId = entity.ProfileId, AccountId = account.AccountId }, transaction);
                    }
                }

                return true;
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning accounts to profile {ProfileId}", entity.ProfileId);
            return false;
        }
    }

    public async Task<ServerResponse> CreateUserWithProfileAsync(UserMaster entity)
    {
        try
        {
            await _dapperService.ExecuteInTransactionAsync<int>(async (connection, transaction) =>
            {
                var parameters = new DynamicParameters();
                parameters.Add("OrgId", entity.OrgId, DbType.Decimal);
                parameters.Add("LoginId", entity.LoginId, DbType.String);
                parameters.Add("Password", entity.Password, DbType.String);
                parameters.Add("EmailId", entity.EmailId, DbType.String);
                parameters.Add("MobileNo", entity.MobileNo, DbType.String);
                parameters.Add("UserName", entity.UserName, DbType.String);
                parameters.Add("RoleId", entity.RoleId, DbType.Decimal);
                parameters.Add("AccountId", entity.AccountId, DbType.Decimal);

                await connection.ExecuteAsync("Proc_Create_User", parameters, transaction, commandType: CommandType.StoredProcedure);
                return 0;
            });

            return new ServerResponse { IsSuccess = true };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user {LoginId}", entity.LoginId);
            return new ServerResponse { IsSuccess = false, Error = ex.Message };
        }
    }

    public async Task<ServerResponse> SendVerificationCodeAsync(decimal userId, string mobileNo)
    {
        const string checkSql = "SELECT COUNT(*) FROM UserMaster WHERE MobileNo = @MobileNo";
        var existing = await _dapperService.QuerySingleOrDefaultAsync<int>(checkSql, new { MobileNo = mobileNo });
        if (existing > 0)
        {
            return new ServerResponse { IsSuccess = false, Error = "This Mobile No is already registered." };
        }

        var verificationCode = new Random().Next(1000, 9999).ToString();
        var smsResponse = await _smsSender.SendMsgForMobVerifAsync(mobileNo, verificationCode);
        if (smsResponse.status_code != 200)
        {
            return new ServerResponse { IsSuccess = false, Error = "Unable to send Verification code." };
        }

        var saved = await SaveMobileVerificationCodeAsync(userId, verificationCode);
        if (!saved)
        {
            return new ServerResponse { IsSuccess = false, Error = "Unable to save Verification code." };
        }

        return new ServerResponse { IsSuccess = true, Data = "Verification code is sent." };
    }

    public async Task<ServerResponse> SendLoginOtpAsync(string mobileNo)
    {
        const string checkSql = "SELECT COUNT(*) FROM UserMaster WHERE MobileNo = @MobileNo";
        var existing = await _dapperService.QuerySingleOrDefaultAsync<int>(checkSql, new { MobileNo = mobileNo });
        if (existing != 1)
        {
            return new ServerResponse { IsSuccess = false, Error = "This Mobile # is not registered OR is incorrect. Please confirm." };
        }

        var otp = new Random().Next(1000, 9999).ToString();
        var smsResponse = await _smsSender.SendMsgForLoginOTPAsync(mobileNo, otp);
        if (smsResponse.status_code != 200)
        {
            return new ServerResponse { IsSuccess = false, Error = "Unable to send OTP" };
        }

        var saved = await SaveOtpAsync(mobileNo, otp);
        if (!saved)
        {
            return new ServerResponse { IsSuccess = false, Error = "Not Authenticated" };
        }

        return new ServerResponse { IsSuccess = true, Data = "OTP is sent." };
    }

    private async Task<bool> SaveOtpAsync(string mobileNo, string otp)
    {
        var parameters = new DynamicParameters();
        parameters.Add("MobileNo", mobileNo, DbType.String);
        parameters.Add("Otp", otp, DbType.String);
        parameters.Add("OperStatus", dbType: DbType.Int16, direction: ParameterDirection.Output);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Save_User_Otp", parameters);
        var operStatus = parameters.Get<short>("OperStatus");
        return operStatus == 1;
    }

    private async Task<bool> SaveMobileVerificationCodeAsync(decimal userId, string otp)
    {
        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId, DbType.Decimal);
        parameters.Add("Otp", otp, DbType.String);
        parameters.Add("OperStatus", dbType: DbType.Int16, direction: ParameterDirection.Output);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Save_User_Mobile_Verification_Code", parameters);
        var operStatus = parameters.Get<short>("OperStatus");
        return operStatus == 1;
    }

    public async Task<ServerResponse> VerifyAndSaveMobileNoAsync(decimal userId, string mobileNo, string otp)
    {
        const string checkSql = "SELECT COUNT(*) FROM UserMaster WHERE MobileNo = @MobileNo";
        var existing = await _dapperService.QuerySingleOrDefaultAsync<int>(checkSql, new { MobileNo = mobileNo });
        if (existing > 0)
        {
            return new ServerResponse { IsSuccess = false, Error = "This Mobile # is already registered." };
        }

        var parameters = new DynamicParameters();
        parameters.Add("UserId", userId, DbType.Decimal);
        parameters.Add("MobileNo", mobileNo, DbType.String);
        parameters.Add("Otp", otp, DbType.String);
        parameters.Add("OperStatus", dbType: DbType.Int16, direction: ParameterDirection.Output);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Save_MobileNo", parameters);
        var operStatus = parameters.Get<short>("OperStatus");
        if (operStatus == 0)
        {
            return new ServerResponse { IsSuccess = false, Error = "Verification code does not match or expired." };
        }

        return new ServerResponse { IsSuccess = true, Data = "Mobile # is registered successfully." };
    }

    public async Task<ServerResponse> AuthorizeMeOtpAsync(string mobileNo, string otp)
    {
        var accessKey = Guid.NewGuid().ToString("N");
        var parameters = new DynamicParameters();
        parameters.Add("MobileNo", mobileNo, DbType.String);
        parameters.Add("Otp", otp, DbType.String);
        parameters.Add("AccessKey", accessKey, DbType.String);
        parameters.Add("OperStatus", dbType: DbType.Int16, direction: ParameterDirection.Output);

        await _dapperService.ExecuteStoredProcedureAsync("Proc_Authenticate_User_Otp", parameters);
        var operStatus = parameters.Get<short>("OperStatus");
        if (operStatus == 0)
        {
            return new ServerResponse { IsSuccess = false, Error = "Not Authenticated" };
        }

        const string sql = @"SELECT UM.*, UP.OrgId, UP.ProfileId, OM.OrgName, OM.Address, UPR.RoleId
FROM UserMaster UM
INNER JOIN UserProfile UP ON UM.UserId = UP.UserId
INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
INNER JOIN OrgMaster OM ON UP.OrgId = OM.OrgId
WHERE UM.MobileNo = @MobileNo";

        var user = await _dapperService.QuerySingleOrDefaultAsync<UserMaster>(sql, new { MobileNo = mobileNo });
        if (user == null)
        {
            return new ServerResponse { IsSuccess = false, Error = "Record not found" };
        }

        return new ServerResponse { IsSuccess = true, Data = user };
    }

    private static string GenRandomAlphanumericString(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
