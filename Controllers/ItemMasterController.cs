using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemMasterController : ControllerBase
{
    private readonly ItemMasterService _service;

    public ItemMasterController(ItemMasterService service)
    {
        _service = service;
    }

    // GET: api/itemmaster/list?orgId=1
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<ItemMaster>>> GetList([FromQuery] int orgId)
    {
        var data = await _service.GetRecordsAsync(orgId);
        return Ok(data);
    }

    // GET: api/itemmaster/entity/5
    [HttpGet("entity/{id:int}")]
    public async Task<ActionResult<ItemMaster?>> GetEntity(int id)
    {
        var entity = await _service.GetRecordByIdAsync(id);
        if (entity == null)
        {
            return NotFound();
        }
        return Ok(entity);
    }
}
