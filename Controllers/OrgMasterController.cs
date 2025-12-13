using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrgMasterController : ControllerBase
{
    private readonly OrgMasterService _service;

    public OrgMasterController(OrgMasterService service)
    {
        _service = service;
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

    // POST: api/orgmaster/save
    [HttpPost("save")]
    public async Task<ActionResult<OrgMaster>> Save([FromBody] OrgMaster entity)
    {
        if (entity == null)
        {
            return BadRequest("Entity is required");
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
