using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("item")]
public class ItemMasterController : ControllerBase
{
    private readonly ItemMasterService _service;
    private readonly ILogger<ItemMasterController> _logger;

    public ItemMasterController(ItemMasterService service, ILogger<ItemMasterController> logger)
    {
        _service = service;
        _logger = logger;
    }

    // GET: api/itemmaster/list?orgId=1
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<ItemMaster>>> GetList([FromQuery] int orgId)
    {
        _logger.LogInformation("GetList endpoint called for OrgId {OrgId}", orgId);
        var data = await _service.GetRecordsAsync(orgId);
        _logger.LogInformation("GetList completed for OrgId {OrgId}", orgId);
        return Ok(data);
    }

    // GET: api/itemmaster/entity/5
    [HttpGet("entity/{id:int}")]
    public async Task<ActionResult<ItemMaster?>> GetEntity(int id)
    {
        _logger.LogInformation("GetEntity endpoint called for Id {Id}", id);
        var entity = await _service.GetRecordByIdAsync(id);
        if (entity == null)
        {
            _logger.LogWarning("GetEntity entity with Id {Id} not found", id);
            return NotFound();
        }
        _logger.LogInformation("GetEntity completed for Id {Id}", id);
        return Ok(entity);
    }

    // POST: item/save
    [HttpPost("save")]
    public async Task<ActionResult<ServerResponse>> Save([FromForm] ItemMaster entity)
    {
        if (entity == null)
        {
            _logger.LogWarning("Save endpoint called with null entity");
            return BadRequest(new ServerResponse { IsSuccess = false, Error = "Entity is required" });
        }

        _logger.LogInformation("Save endpoint called for ItemId {ItemId}, ItemName {ItemName}, OrgId {OrgId}", entity.ItemId, entity.ItemName, entity.OrgId);
        try
        {
            var success = await _service.AddUpdateAsync(entity);
            _logger.LogInformation("Save completed for ItemId {ItemId}, success: {Success}", entity.ItemId, success);
            return Ok(new ServerResponse { IsSuccess = success });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving ItemId {ItemId}", entity.ItemId);
            return Ok(new ServerResponse { IsSuccess = false, Error = ex.Message });
        }
    }

    // POST: item/delete
    [HttpPost("delete")]
    public async Task<ActionResult<ServerResponse>> Delete([FromForm] decimal id)
    {
        _logger.LogInformation("Delete endpoint called for Id {Id}", id);
        var success = await _service.DeleteRecAsync(id);
        _logger.LogInformation("Delete completed for Id {Id}, success: {Success}", id, success);
        return Ok(new ServerResponse { IsSuccess = success });
    }
}
