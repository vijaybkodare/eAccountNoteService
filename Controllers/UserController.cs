using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;
using eAccountNoteService.Filters;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("user")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet("Hello")]
    public IActionResult Hello()
    {
        return Ok("Hi hello");
    }

    [HttpPost("delete")]
    public async Task<ActionResult<ServerResponse>> Delete([FromForm] decimal id)
    {
        var success = await _userService.DeleteUserAsync(id);
        return Ok(new ServerResponse { IsSuccess = success });
    }

    [HttpGet("UpdatePassword")]
    public async Task<ActionResult<ServerResponse>> UpdatePassword([FromQuery] string LoginId, [FromQuery] string OldPassword, [FromQuery] string NewPassword)
    {
        var response = await _userService.UpdatePasswordAsync(LoginId, OldPassword, NewPassword);
        return Ok(response);
    }

    [HttpGet("ResetPassword")]
    public async Task<ActionResult<ServerResponse>> ResetPassword([FromQuery] string LoginId)
    {
        var response = await _userService.ResetPasswordAsync(LoginId);
        return Ok(response);
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<UserMaster>>> List([FromQuery] decimal orgId)
    {
        var users = await _userService.GetUsersAsync(orgId);
        return Ok(users);
    }

    [HttpGet("userAccounts")]
    public async Task<ActionResult<IEnumerable<AccountMaster>>> UserAccounts([FromQuery] decimal profileId)
    {
        var accounts = await _userService.GetUserAccountsAsync(profileId);
        return Ok(accounts);
    }

    [HttpPost("saveUserAccountAssignment")]
    public async Task<ActionResult<ServerResponse>> SaveUserAccountAssignment([FromForm] UserMaster entity)
    {
        var success = await _userService.AssignUserAccountAsync(entity);
        return Ok(new ServerResponse { IsSuccess = success });
    }

    [HttpPost("createUserWithProfile")]
    public async Task<ActionResult<ServerResponse>> CreateUserWithProfile([FromForm] UserMaster entity)
    {
        var response = await _userService.CreateUserWithProfileAsync(entity);
        return Ok(response);
    }
    [SkipAuthFilter]
    [HttpGet("AuthorizeMe_Otp")]
    public async Task<ActionResult<ServerResponse>> AuthorizeMeOtp([FromQuery] string mobileNo, [FromQuery] string otp)
    {
        var response = await _userService.AuthorizeMeOtpAsync(mobileNo, otp);
        return Ok(response);
    }
    [SkipAuthFilter]
    [HttpGet("SendOtp")]
    public async Task<ActionResult<ServerResponse>> SendOtp([FromQuery] string mobileNo)
    {
        var response = await _userService.SendLoginOtpAsync(mobileNo);
        return Ok(response);
    }

    [HttpGet("SendVerificationCode")]
    public async Task<ActionResult<ServerResponse>> SendVerificationCode([FromQuery] decimal userId, [FromQuery] string mobileNo)
    {
        var response = await _userService.SendVerificationCodeAsync(userId, mobileNo);
        return Ok(response);
    }

    [HttpGet("VerifyAndSave")]
    public async Task<ActionResult<ServerResponse>> VerifyAndSave([FromQuery] decimal userId, [FromQuery] string mobileNo, [FromQuery] string otp)
    {
        var response = await _userService.VerifyAndSaveMobileNoAsync(userId, mobileNo, otp);
        return Ok(response);
    }
}
