using eAccountNoteService.Filters;
using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[SkipAuthFilter]
[ApiController]
[Route("api/[controller]")]
public class AppInitController : ControllerBase
{
    private readonly AppInitService _appInitService;

    public AppInitController(AppInitService appInitService)
    {
        _appInitService = appInitService;
    }

    // POST: api/AppInit/initiate or api/app/initiate or api/initiate
    [HttpPost("initiate")]
    [HttpPost("/api/app/initiate")]
    [HttpPost("/api/initiate")]
    [HttpPost("")]
    public async Task<ActionResult<ServerResponse>> Initiate([FromBody] InitiateAppRequest request)
    {
        var response = await _appInitService.InitiateAppAsync(request);
        return Ok(response);
    }

    // GET: api/AppInit/status or api/app/status
    [HttpGet("status")]
    [HttpGet("/api/app/status")]
    public async Task<ActionResult<ServerResponse>> Status()
    {
        var isInitiated = await _appInitService.IsAppInitiatedAsync();
        return Ok(new ServerResponse
        {
            IsSuccess = true,
            Data = new
            {
                IsInitiated = isInitiated
            }
        });
    }
}
