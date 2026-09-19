using eAccountNoteService.Filters;
using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;
using eAccountNoteService.Utility;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdvChargeController : ControllerBase
{
    private readonly AdvChargeService _service;
    private readonly TransNoEvaluator _transNoEvaluator;

    public AdvChargeController(AdvChargeService service, TransNoEvaluator transNoEvaluator)
    {
        _service = service;
        _transNoEvaluator = transNoEvaluator;
    }

    // GET: api/advcharge/entity?orgId=1
    [HttpGet("entity")]
    [RequiresPermission("adv_charge.view")]
    public async Task<ActionResult<AdvCharge>> GetEntity([FromQuery] decimal orgId)
    {
        var entity = await _service.GetRecordAsync(orgId);
        return Ok(entity);
    }

    // GET: api/advcharge/list?orgId=1
    [HttpGet("list")]
    [RequiresPermission("adv_charge.view")]
    public async Task<ActionResult<IEnumerable<AdvCharge>>> GetList([FromQuery] decimal orgId)
    {
        var list = await _service.GetRecordsAsync(orgId);
        return Ok(list);
    }

    // POST: api/advcharge/save
    [HttpPost("save")]
    [RequiresPermission("adv_charge.create")]
    public async Task<ActionResult<ServerResponse>> Save([FromBody] AdvCharge entity)
    {
        var response = new ServerResponse { IsSuccess = false };

        if (string.IsNullOrWhiteSpace(entity.TransactionId))
        {
            response.Error = "Transaction Id can't be empty.";
            return Ok(response);
        }

        if (await _transNoEvaluator.IsTransactionIdExistAsync(entity.OrgId, entity.TransactionId, entity.AdvChargeId, "ADVC"))
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
    [RequiresPermission("adv_charge.view")]
    public async Task<ActionResult<AdvCharge>> GetAccountSummary([FromQuery] decimal accountId)
    {
        var summary = await _service.GetGroupAccountSummaryAsync(accountId);
        return Ok(summary);
    }
}
