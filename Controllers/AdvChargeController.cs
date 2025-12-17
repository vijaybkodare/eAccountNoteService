using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdvChargeController : ControllerBase
{
    private readonly AdvChargeService _service;

    public AdvChargeController(AdvChargeService service)
    {
        _service = service;
    }

    // GET: api/advcharge/entity?orgId=1
    [HttpGet("entity")]
    public async Task<ActionResult<AdvCharge>> GetEntity([FromQuery] decimal orgId)
    {
        var entity = await _service.GetRecordAsync(orgId);
        return Ok(entity);
    }

    // GET: api/advcharge/list?orgId=1
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<AdvCharge>>> GetList([FromQuery] decimal orgId)
    {
        var list = await _service.GetRecordsAsync(orgId);
        return Ok(list);
    }

    // POST: api/advcharge/save
    [HttpPost("save")]
    public async Task<ActionResult<ServerResponse>> Save([FromBody] AdvCharge entity)
    {
        var response = new ServerResponse { IsSuccess = false };

        if (string.IsNullOrWhiteSpace(entity.TransactionId))
        {
            response.Error = "Transaction Id can't be empty.";
            return Ok(response);
        }

        if (await _service.TransactionIdExistsAsync(entity.OrgId, entity.TransactionId))
        {
            response.Error = "App alreadey contain entry with given Transaction ID. Can't be saved.";
            return Ok(response);
        }

        var result = await _service.AddAsync(entity);
        response.IsSuccess = result.Success;
        response.Error = result.ErrorMessage;
        return Ok(response);
    }

    // GET: api/advcharge/account_summary?accountId=1
    [HttpGet("account_summary")]
    public async Task<ActionResult<AdvCharge>> GetAccountSummary([FromQuery] decimal accountId)
    {
        var summary = await _service.GetAccountSummaryAsync(accountId);
        return Ok(summary);
    }
}
