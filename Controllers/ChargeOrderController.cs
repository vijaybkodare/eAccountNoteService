using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChargeOrderController : ControllerBase
{
    private readonly ChargeOrderService _service;

    public ChargeOrderController(ChargeOrderService service)
    {
        _service = service;
    }

    // GET: api/chargeorder/hello
    [HttpGet("hello")]
    public IActionResult Hello()
    {
        return Ok("Hi hello");
    }

    // GET: api/chargeorder/latestEntity?orgId=1
    [HttpGet("latestEntity")]
    public async Task<ActionResult<ServerResponse>> LatestEntity([FromQuery] decimal orgId)
    {
        var entity = await _service.GetLatestRecordAsync(orgId);
        return Ok(new ServerResponse { IsSuccess = true, Data = entity });
    }

    // GET: api/chargeorder/entity?chargeOrderId=0&orgId=1
    [HttpGet("entity")]
    public async Task<ActionResult<ServerResponse>> GetEntity([FromQuery] decimal chargeOrderId, [FromQuery] decimal orgId)
    {
        var entity = await _service.GetRecordAsync(chargeOrderId, orgId);
        return Ok(new ServerResponse { IsSuccess = true, Data = entity });
    }

    // GET: api/chargeorder/list?orgId=1&fromDate=2024-01-01&toDate=2024-12-31
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<ChargeOrder>>> GetList([FromQuery] int orgId, [FromQuery] string? fromDate, [FromQuery] string? toDate)
    {
        var list = await _service.GetRecordsAsync(orgId, fromDate, toDate);
        return Ok(list);
    }

    // POST: api/chargeorder/save
    // NOTE: Full transactional save with ChargePayeeDetails is not implemented yet.
    [HttpPost("save")]
    public ActionResult<ServerResponse> Save([FromBody] ChargeOrder entity)
    {
        return Ok(new ServerResponse
        {
            IsSuccess = false,
            Error = "ChargeOrder save with ChargePayeeDetails is not implemented in this API yet.",
            Data = null
        });
    }

    // POST: api/chargeorder/makeAccountChargeZero/{chargePayeeDetailId}
    [HttpPost("makeAccountChargeZero/{chargePayeeDetailId:decimal}")]
    public ActionResult<ServerResponse> MakeAccountChargeZero(decimal chargePayeeDetailId)
    {
        return Ok(new ServerResponse
        {
            IsSuccess = false,
            Error = "makeAccountChargeZero is not implemented in this API yet.",
            Data = null
        });
    }

    // The following endpoints are stubs corresponding to legacy payAccounts, payCharges, chargePayment,
    // updateChargePayTrans, and cummulativeChargePayment. They currently return a not-implemented response.

    // GET: api/chargeorder/payAccounts?profileId=1
    [HttpGet("payAccounts")]
    public ActionResult<IEnumerable<object>> PayAccounts([FromQuery] decimal profileId)
    {
        return Ok(new { IsSuccess = false, Error = "payAccounts is not implemented in this API yet." });
    }

    // GET: api/chargeorder/payCharges?orgId=1&accountId=1
    [HttpGet("payCharges")]
    public ActionResult<IEnumerable<object>> PayCharges([FromQuery] decimal orgId, [FromQuery] decimal accountId)
    {
        return Ok(new { IsSuccess = false, Error = "payCharges is not implemented in this API yet." });
    }

    // POST: api/chargeorder/chargePayment
    [HttpPost("chargePayment")]
    public ActionResult<ServerResponse> ChargePayment([FromBody] object entity)
    {
        return Ok(new ServerResponse
        {
            IsSuccess = false,
            Error = "chargePayment is not implemented in this API yet.",
            Data = null
        });
    }

    // POST: api/chargeorder/updateChargePayTrans
    [HttpPost("updateChargePayTrans")]
    public ActionResult<ServerResponse> UpdateChargePayTrans([FromBody] object entity)
    {
        return Ok(new ServerResponse
        {
            IsSuccess = false,
            Error = "updateChargePayTrans is not implemented in this API yet.",
            Data = null
        });
    }

    // POST: api/chargeorder/cummulativeChargePayment
    [HttpPost("cummulativeChargePayment")]
    public ActionResult<ServerResponse> CummulativeChargePayment([FromBody] object entity)
    {
        return Ok(new ServerResponse
        {
            IsSuccess = false,
            Error = "cummulativeChargePayment is not implemented in this API yet.",
            Data = null
        });
    }
}
