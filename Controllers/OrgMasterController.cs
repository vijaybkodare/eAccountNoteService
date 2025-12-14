using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/Org")]
public class OrgMasterController : ControllerBase
{
    private readonly OrgMasterService _service;
    private readonly UserService _userService;

    public OrgMasterController(OrgMasterService service, UserService userService)
    {
        _service = service;
        _userService = userService;
    }

    // GET: api/orgmaster/list
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<OrgMaster>>> GetList()
    {
        var data = await _service.GetRecordsAsync();
        return Ok(data);
    }

    // GET: api/orgmaster/entity/5
    [HttpGet("entity/{id:int}")]
    public async Task<ActionResult<OrgMaster?>> GetEntity(int id)
    {
        var entity = await _service.GetRecordAsync(id);
        if (entity == null)
        {
            return NotFound();
        }
        return Ok(entity);
    }

    // POST: api/Org/save
    // This mirrors legacy OrgController.save(UserMaster), using Proc_Create_User under the hood
    [HttpPost("save")]
    public async Task<ActionResult<ServerResponse>> Save([FromBody] UserMaster entity)
    {
        if (entity == null)
        {
            return BadRequest("Entity is required");
        }

        var response = await _userService.SaveUserAndOrgAsync(entity);
        return Ok(response);
    }

    // POST: api/Org/update
    [HttpPost("update")]
    public async Task<ActionResult<OrgMaster>> Update([FromBody] OrgMaster entity)
    {
        if (entity == null)
        {
            return BadRequest("Entity is required");
        }

        if (entity.OrgId == 0)
        {
            return BadRequest("OrgId is required for update");
        }

        var saved = await _service.SaveRecordAsync(entity);
        return Ok(saved);
    }

    // DELETE: api/orgmaster/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteRecordAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
