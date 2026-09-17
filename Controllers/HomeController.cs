using eAccountNoteService.Filters;
using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[SkipAuthFilter]
[ApiController]
[Route("home")]
public class HomeController : ControllerBase
{
    private readonly UserAuthService _authService;

    public HomeController(UserAuthService authService)
    {
        _authService = authService;
    }

    // GET: home/AuthorizeMe?LoginId=...&Password=...
    // Authenticates user credentials and returns base user details (without org/profile details)
    [HttpGet("AuthorizeMe")]
    public async Task<ActionResult<ServerResponse>> AuthorizeMe([FromQuery] string LoginId, [FromQuery] string Password)
    {
        if (string.IsNullOrWhiteSpace(LoginId) || string.IsNullOrWhiteSpace(Password))
        {
            return Ok(new ServerResponse
            {
                IsSuccess = false,
                Error = "LoginId and Password are required."
            });
        }

        var response = await _authService.AuthorizeMeAsync(LoginId, Password);
        return Ok(response);
    }

    // GET: home/getUserOrgProfile?userId=...&orgId=...
    // Returns full user details along with selected org details
    [HttpGet("getUserOrgProfile")]
    public async Task<ActionResult<ServerResponse>> GetUserOrgProfile(
        [FromQuery] decimal userId, 
        [FromQuery] decimal orgId)
    {
        if (userId <= 0 || orgId <= 0)
        {
            return Ok(new ServerResponse
            {
                IsSuccess = false,
                Error = "UserId and OrgId are required."
            });
        }

        var response = await _authService.GetUserOrgProfileAsync(userId, orgId);
        return Ok(response);
    }
}
