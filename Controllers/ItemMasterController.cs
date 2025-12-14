using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("item")]
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

    // POST: item/save
    [HttpPost("save")]
    public async Task<ActionResult<ServerResponse>> Save([FromForm] ItemMaster entity)
    {
        if (entity == null)
        {
            return BadRequest(new ServerResponse { IsSuccess = false, Error = "Entity is required" });
        }

        try
        {
            var success = await _service.AddUpdateAsync(entity);
            return Ok(new ServerResponse { IsSuccess = success });
        }
        catch (Exception ex)
        {
            return Ok(new ServerResponse { IsSuccess = false, Error = ex.Message });
        }
    }

    // POST: item/delete
    [HttpPost("delete")]
    public async Task<ActionResult<ServerResponse>> Delete([FromForm] decimal id)
    {
        var success = await _service.DeleteRecAsync(id);
        return Ok(new ServerResponse { IsSuccess = success });
    }
}
