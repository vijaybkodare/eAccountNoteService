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
    // Used by legacy front-end for username/password login.
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
}
