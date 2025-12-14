using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("account")]
public class AccountMasterController : ControllerBase
{
    private readonly AccountMasterService _service;

    public AccountMasterController(AccountMasterService service)
    {
        _service = service;
    }

    // GET: api/accountmaster/list?orgId=1
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<AccountMaster>>> GetList([FromQuery] int orgId)
    {
        var data = await _service.GetRecordsAsync(orgId);
        return Ok(data);
    }

    // GET: api/accountmaster/entity/5
    [HttpGet("entity/{id:decimal}")]
    public async Task<ActionResult<AccountMaster?>> GetEntity(decimal id)
    {
        var entity = await _service.GetRecordAsync(id);
        if (entity == null)
        {
            return NotFound();
        }
        return Ok(entity);
    }

    // GET: api/accountmaster/summary/1
    [HttpGet("summary/{orgId:int}")]
    public async Task<ActionResult<AccountSummary>> GetSummary(int orgId)
    {
        var summary = await _service.GetAccountSummaryAsync(orgId);
        return Ok(summary);
    }

    // POST: api/accountmaster/save
    [HttpPost("save")]
    public async Task<ActionResult<ServerResponse>> Save([FromForm] AccountMaster entity)
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

    // DELETE: api/accountmaster/delete/5
    [HttpDelete("delete/{id:decimal}")]
    public async Task<ActionResult<ServerResponse>> Delete(decimal id)
    {
        var success = await _service.DeleteRecAsync(id);
        return Ok(new ServerResponse { IsSuccess = success });
    }
}
