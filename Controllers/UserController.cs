using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;
using eAccountNoteService.Filters;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("user")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(UserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet("Hello")]
    public IActionResult Hello()
    {
        _logger.LogInformation("Hello endpoint called");
        return Ok("Hi hello");
    }

    [HttpPost("delete")]
    public async Task<ActionResult<ServerResponse>> Delete([FromForm] decimal id)
    {
        _logger.LogInformation("Delete endpoint called with Id {Id}", id);
        var success = await _userService.DeleteUserAsync(id);
        _logger.LogInformation("Delete user status for Id {Id}: {Success}", id, success);
        return Ok(new ServerResponse { IsSuccess = success });
    }

    [HttpGet("UpdatePassword")]
    public async Task<ActionResult<ServerResponse>> UpdatePassword([FromQuery] string LoginId, [FromQuery] string OldPassword, [FromQuery] string NewPassword)
    {
        _logger.LogInformation("UpdatePassword endpoint called for LoginId {LoginId}", LoginId);
        var response = await _userService.UpdatePasswordAsync(LoginId, OldPassword, NewPassword);
        _logger.LogInformation("UpdatePassword response for LoginId {LoginId}: IsSuccess={IsSuccess}, Error={Error}", LoginId, response.IsSuccess, response.Error);
        return Ok(response);
    }

    [HttpGet("ResetPassword")]
    public async Task<ActionResult<ServerResponse>> ResetPassword([FromQuery] string LoginId)
    {
        _logger.LogInformation("ResetPassword endpoint called for LoginId {LoginId}", LoginId);
        var response = await _userService.ResetPasswordAsync(LoginId);
        _logger.LogInformation("ResetPassword response for LoginId {LoginId}: IsSuccess={IsSuccess}, Error={Error}", LoginId, response.IsSuccess, response.Error);
        return Ok(response);
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<UserMaster>>> List([FromQuery] decimal orgId)
    {
        _logger.LogInformation("List endpoint called for OrgId {OrgId}", orgId);
        var users = await _userService.GetUsersAsync(orgId);
        _logger.LogInformation("List endpoint executed for OrgId {OrgId}", orgId);
        return Ok(users);
    }

    [HttpGet("userAccounts")]
    public async Task<ActionResult<IEnumerable<AccountMaster>>> UserAccounts([FromQuery] decimal profileId)
    {
        _logger.LogInformation("UserAccounts endpoint called for ProfileId {ProfileId}", profileId);
        var accounts = await _userService.GetUserAccountsAsync(profileId);
        _logger.LogInformation("UserAccounts endpoint executed for ProfileId {ProfileId}", profileId);
        return Ok(accounts);
    }

    [HttpPost("saveUserAccountAssignment")]
    public async Task<ActionResult<ServerResponse>> SaveUserAccountAssignment([FromForm] UserMaster entity)
    {
        _logger.LogInformation("SaveUserAccountAssignment endpoint called for UserId {UserId}, OrgId {OrgId}", entity.UserId, entity.OrgId);
        var success = await _userService.AssignUserAccountAsync(entity);
        _logger.LogInformation("SaveUserAccountAssignment execution status for UserId {UserId}: {Success}", entity.UserId, success);
        return Ok(new ServerResponse { IsSuccess = success });
    }

    [HttpPost("createUserWithProfile")]
    public async Task<ActionResult<ServerResponse>> CreateUserWithProfile([FromForm] UserMaster entity)
    {
        _logger.LogInformation("CreateUserWithProfile endpoint called for LoginId {LoginId}, OrgId {OrgId}", entity.LoginId, entity.OrgId);
        var response = await _userService.CreateUserWithProfileAsync(entity);
        _logger.LogInformation("CreateUserWithProfile response for LoginId {LoginId}: IsSuccess={IsSuccess}, Error={Error}", entity.LoginId, response.IsSuccess, response.Error);
        return Ok(response);
    }

    [SkipAuthFilter]
    [HttpGet("AuthorizeMe_Otp")]
    public async Task<ActionResult<ServerResponse>> AuthorizeMeOtp([FromQuery] string mobileNo, [FromQuery] string otp)
    {
        _logger.LogInformation("AuthorizeMeOtp endpoint called for MobileNo {MobileNo}", mobileNo);
        var response = await _userService.AuthorizeMeOtpAsync(mobileNo, otp);
        _logger.LogInformation("AuthorizeMeOtp response for MobileNo {MobileNo}: IsSuccess={IsSuccess}, Error={Error}", mobileNo, response.IsSuccess, response.Error);
        return Ok(response);
    }

    [SkipAuthFilter]
    [HttpGet("SendOtp")]
    public async Task<ActionResult<ServerResponse>> SendOtp([FromQuery] string mobileNo)
    {
        _logger.LogInformation("SendOtp endpoint called for MobileNo {MobileNo}", mobileNo);
        var response = await _userService.SendLoginOtpAsync(mobileNo);
        _logger.LogInformation("SendOtp response for MobileNo {MobileNo}: IsSuccess={IsSuccess}, Error={Error}", mobileNo, response.IsSuccess, response.Error);
        return Ok(response);
    }

    [HttpGet("SendVerificationCode")]
    public async Task<ActionResult<ServerResponse>> SendVerificationCode([FromQuery] decimal userId, [FromQuery] string mobileNo)
    {
        _logger.LogInformation("SendVerificationCode endpoint called for UserId {UserId}, MobileNo {MobileNo}", userId, mobileNo);
        var response = await _userService.SendVerificationCodeAsync(userId, mobileNo);
        _logger.LogInformation("SendVerificationCode response for UserId {UserId}: IsSuccess={IsSuccess}, Error={Error}", userId, response.IsSuccess, response.Error);
        return Ok(response);
    }

    [HttpGet("VerifyAndSave")]
    public async Task<ActionResult<ServerResponse>> VerifyAndSave([FromQuery] decimal userId, [FromQuery] string mobileNo, [FromQuery] string otp)
    {
        _logger.LogInformation("VerifyAndSave endpoint called for UserId {UserId}, MobileNo {MobileNo}", userId, mobileNo);
        var response = await _userService.VerifyAndSaveMobileNoAsync(userId, mobileNo, otp);
        _logger.LogInformation("VerifyAndSave response for UserId {UserId}: IsSuccess={IsSuccess}, Error={Error}", userId, response.IsSuccess, response.Error);
        return Ok(response);
    }
}
