using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("account")]
public class AccountMasterController : ControllerBase
{
    private readonly AccountMasterService _service;
    private readonly ILogger<AccountMasterController> _logger;

    public AccountMasterController(AccountMasterService service, ILogger<AccountMasterController> logger)
    {
        _service = service;
        _logger = logger;
    }

    // GET: api/accountmaster/list?orgId=1
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<AccountMaster>>> GetList([FromQuery] int orgId)
    {
        _logger.LogInformation("GetList endpoint called for OrgId {OrgId}", orgId);
        var data = await _service.GetRecordsAsync(orgId);
        _logger.LogInformation("GetList completed for OrgId {OrgId}", orgId);
        return Ok(data);
    }

    // GET: api/accountmaster/entity/5
    [HttpGet("entity/{id:decimal}")]
    public async Task<ActionResult<AccountMaster?>> GetEntity(decimal id)
    {
        _logger.LogInformation("GetEntity endpoint called for Id {Id}", id);
        var entity = await _service.GetRecordAsync(id);
        if (entity == null)
        {
            _logger.LogWarning("GetEntity entity with Id {Id} not found", id);
            return NotFound();
        }
        _logger.LogInformation("GetEntity completed for Id {Id}", id);
        return Ok(entity);
    }

    // GET: api/accountmaster/summary/1
    [HttpGet("summary/{orgId:int}")]
    public async Task<ActionResult<AccountSummary>> GetSummary(int orgId)
    {
        _logger.LogInformation("GetSummary endpoint called for OrgId {OrgId}", orgId);
        var summary = await _service.GetAccountSummaryAsync(orgId);
        _logger.LogInformation("GetSummary completed for OrgId {OrgId}", orgId);
        return Ok(summary);
    }

    // POST: api/accountmaster/save
    [HttpPost("save")]
    public async Task<ActionResult<ServerResponse>> Save([FromForm] AccountMaster entity)
    {
        if (entity == null)
        {
            _logger.LogWarning("Save endpoint called with null entity");
            return BadRequest(new ServerResponse { IsSuccess = false, Error = "Entity is required" });
        }

        _logger.LogInformation("Save endpoint called for AccountId {AccountId}, AccountName {AccountName}, OrgId {OrgId}", entity.AccountId, entity.AccountName, entity.OrgId);
        try
        {
            var success = await _service.AddUpdateAsync(entity);
            _logger.LogInformation("Save completed for AccountId {AccountId}, success: {Success}", entity.AccountId, success);
            return Ok(new ServerResponse { IsSuccess = success });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving AccountId {AccountId}", entity.AccountId);
            return Ok(new ServerResponse { IsSuccess = false, Error = ex.Message });
        }
    }

    // DELETE: api/accountmaster/delete/5
    [HttpDelete("delete/{id:decimal}")]
    public async Task<ActionResult<ServerResponse>> Delete(decimal id)
    {
        _logger.LogInformation("Delete endpoint called for Id {Id}", id);
        var success = await _service.DeleteRecAsync(id);
        _logger.LogInformation("Delete completed for Id {Id}, success: {Success}", id, success);
        return Ok(new ServerResponse { IsSuccess = success });
    }
}
