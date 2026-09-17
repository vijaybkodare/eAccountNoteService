using Microsoft.AspNetCore.Mvc;
using eAccountNoteService.Filters;
using eAccountNoteService.Models;
using eAccountNoteService.Services;

namespace eAccountNoteService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserOrgController : ControllerBase
{
    private readonly IUserOrgService _userOrgService;
    private readonly UserAuthService _authService;

    public UserOrgController(IUserOrgService userOrgService, UserAuthService authService)
    {
        _userOrgService = userOrgService;
        _authService = authService;
    }

    /// <summary>
    /// Requirement 2: Get list of orgs for which given user is a member
    /// GET api/UserOrg/getUserOrgs?userId=123
    /// </summary>
    [SkipAuthFilter]
    [HttpGet("getUserOrgs")]
    public async Task<IActionResult> GetUserOrgs([FromQuery] decimal userId)
    {
        var result = await _userOrgService.GetUserOrgsAsync(userId);
        return Ok(result);
    }

    /// <summary>
    /// Get user details with selected organization details after org selection
    /// GET api/UserOrg/getUserOrgProfile?userId=123&orgId=1
    /// </summary>
    [SkipAuthFilter]
    [HttpGet("getUserOrgProfile")]
    public async Task<IActionResult> GetUserOrgProfile(
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

    /// <summary>
    /// Requirement 4: Persist user association with multiple orgs
    /// POST api/UserOrg/saveUserOrgs
    /// Body: { "UserId": 10, "OrgIds": [1, 2, 5] }
    /// </summary>
    [HttpPost("saveUserOrgs")]
    public async Task<IActionResult> SaveUserOrgs([FromBody] SaveUserOrgsRequest request)
    {
        if (request == null || request.UserId <= 0)
        {
            return BadRequest(new { IsSuccess = false, Message = "Invalid user id" });
        }

        var result = await _userOrgService.SaveUserOrgsAsync(request.UserId, request.OrgIds);
        return Ok(result);
    }

    /// <summary>
    /// Supporting Requirement 3: Get all users with mapped org counts for Super Admin
    /// GET api/UserOrg/getAllUsers
    /// </summary>
    [HttpGet("getAllUsers")]
    public async Task<IActionResult> GetAllUsers()
    {
        var result = await _userOrgService.GetAllUsersWithOrgCountAsync();
        return Ok(result);
    }
}
