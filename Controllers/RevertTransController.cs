using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("[controller]")]
public class RevertTransController : ControllerBase
{
    private readonly ChargePayTransService _chargePayTransService;
    private readonly CummulativeChargePayTransService _cummulativeChargePayTransService;
    private readonly AdvChargeService _advChargeService;
    private readonly BillPayTransService _billPayTransService;

    public RevertTransController(
        ChargePayTransService chargePayTransService,
        CummulativeChargePayTransService cummulativeChargePayTransService,
        AdvChargeService advChargeService,
        BillPayTransService billPayTransService)
    {
        _chargePayTransService = chargePayTransService;
        _cummulativeChargePayTransService = cummulativeChargePayTransService;
        _advChargeService = advChargeService;
        _billPayTransService = billPayTransService;
    }

    // GET: api/reverttrans/listChargeTrans
    [HttpGet("listChargeTrans")]
    public async Task<ActionResult<IEnumerable<ChargePayTrans>>> ListChargeTrans(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string? fromDate,
        [FromQuery] string? toDate)
    {
        var list = await _chargePayTransService.GetRecordsToRevertAsync(orgId, accountId, fromDate, toDate);
        return Ok(list);
    }

    // GET: api/reverttrans/listCummulativeChargeTrans
    [HttpGet("listCummulativeChargeTrans")]
    public async Task<ActionResult<IEnumerable<CummulativeChargePayTrans>>> ListCummulativeChargeTrans(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string? fromDate,
        [FromQuery] string? toDate)
    {
        var list = await _cummulativeChargePayTransService.GetRecordsToRevertAsync(orgId, accountId, fromDate, toDate);
        return Ok(list);
    }

    // GET: api/reverttrans/listAdvCharge
    [HttpGet("listAdvCharge")]
    public async Task<ActionResult<IEnumerable<AdvCharge>>> ListAdvCharge(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string? fromDate,
        [FromQuery] string? toDate)
    {
        var list = await _advChargeService.GetRecordsToRevertAsync(orgId, accountId, fromDate, toDate);
        return Ok(list);
    }

    // GET: api/reverttrans/listBillTrans
    [HttpGet("listBillTrans")]
    public async Task<ActionResult<IEnumerable<BillPayTrans>>> ListBillTrans(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string? fromDate,
        [FromQuery] string? toDate)
    {
        var list = await _billPayTransService.GetRecordsToRevertAsync(orgId, accountId, fromDate, toDate);
        return Ok(list);
    }

    // GET: api/reverttrans/revertAdvChargeTrans/{id}
    [HttpGet("revertAdvChargeTrans")]
    public async Task<ActionResult<ServerResponse>> RevertAdvChargeTrans([FromQuery] decimal id)
    {
        var result = await _advChargeService.RevertAsync(id);
        return Ok(new ServerResponse { IsSuccess = result.Success, Error = result.ErrorMessage });
    }

    // GET: api/reverttrans/revertChargeTrans/{id}
    [HttpGet("revertChargeTrans")]
    public async Task<ActionResult<ServerResponse>> RevertChargeTrans([FromQuery] decimal id)
    {
        var result = await _chargePayTransService.RevertAsync(id);
        return Ok(new ServerResponse { IsSuccess = result.Success, Error = result.ErrorMessage });
    }

    // GET: api/reverttrans/revertCummulativeChargeTrans/{id}
    [HttpGet("revertCummulativeChargeTrans")]
    public async Task<ActionResult<ServerResponse>> RevertCummulativeChargeTrans([FromQuery] decimal id)
    {
        var result = await _cummulativeChargePayTransService.RevertAsync(id);
        return Ok(new ServerResponse { IsSuccess = result.Success, Error = result.ErrorMessage });
    }

    // GET: api/reverttrans/revertBillTrans/?id={id}
    [HttpGet("revertBillTrans")]
    public async Task<ActionResult<ServerResponse>> RevertBillTrans([FromQuery] decimal id)
    {
        var result = await _billPayTransService.RevertAsync(id);
        return Ok(new ServerResponse { IsSuccess = result.Success, Error = result.ErrorMessage });
    }
}
