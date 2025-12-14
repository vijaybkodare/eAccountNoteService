using eAccountNoteService.Models;
using eAccountNoteService.Services;
using eAccountNoteService.Utility;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("[controller]")]
public class ChargeOrderController : ControllerBase
{
    private readonly ChargeOrderService _service;
    private readonly ChargePayeeDetailService _chargePayeeDetailService;
    private readonly ChargePayTransService _chargePayTransService;
    private readonly CummulativeChargePayTransService _cummulativeChargePayTransService;
    private readonly TransNoEvaluator _transNoEvaluator;

    public ChargeOrderController(
        ChargeOrderService service,
        ChargePayeeDetailService chargePayeeDetailService,
        ChargePayTransService chargePayTransService,
        CummulativeChargePayTransService cummulativeChargePayTransService,
        TransNoEvaluator transNoEvaluator)
    {
        _service = service;
        _chargePayeeDetailService = chargePayeeDetailService;
        _chargePayTransService = chargePayTransService;
        _cummulativeChargePayTransService = cummulativeChargePayTransService;
        _transNoEvaluator = transNoEvaluator;
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
    public async Task<ActionResult<IEnumerable<AccountMaster>>> PayAccounts([FromQuery] decimal profileId)
    {
        var list = await _chargePayeeDetailService.GetPayAccountsAsync(profileId);
        return Ok(list);
    }

    // GET: api/chargeorder/payCharges?orgId=1&accountId=1
    [HttpGet("payCharges")]
    public async Task<ActionResult<IEnumerable<ChargePayeeDetail>>> PayCharges([FromQuery] decimal orgId, [FromQuery] decimal accountId)
    {
        var list = await _chargePayeeDetailService.GetRecordsAsync(orgId, accountId, string.Empty, string.Empty);
        return Ok(list);
    }

    // POST: api/chargeorder/chargePayment
    [HttpPost("chargePayment")]
    public async Task<ActionResult<ServerResponse>> ChargePayment([FromBody] ChargePayTrans entity)
    {
        var error = string.Empty;
        var success = false;

        try
        {
            if (entity.TransMode == 0)
            {
                if (string.IsNullOrWhiteSpace(entity.TransactionId))
                {
                    error = "Transaction Id can't be empty.";
                }
                else if (await _transNoEvaluator.IsTransactionIdExistAsync(entity.OrgId, entity.TransactionId, -1, string.Empty))
                {
                    error = "App alreadey contain entry with given Transaction ID. Can't be saved.";
                }
            }

            if (string.IsNullOrEmpty(error))
            {
                success = await _chargePayTransService.ChargePaymentAsync(entity);
            }
        }
        catch (Exception ex)
        {
            error = ex.Message;
        }

        return Ok(new ServerResponse { IsSuccess = success, Error = error });
    }

    // POST: api/chargeorder/updateChargePayTrans
    [HttpPost("updateChargePayTrans")]
    public async Task<ActionResult<ServerResponse>> UpdateChargePayTrans([FromBody] ChargePayTrans entity)
    {
        var error = string.Empty;
        var success = false;

        if (entity.TransMode == 0)
        {
            if (string.IsNullOrWhiteSpace(entity.TransactionId))
            {
                error = "Transaction Id can't be empty.";
            }
            else if (await _transNoEvaluator.IsTransactionIdExistAsync(entity.OrgId, entity.TransactionId, entity.Id, entity.Source))
            {
                error = "App alreadey contain entry with given Transaction ID. Can't be saved.";
            }
        }

        if (string.IsNullOrEmpty(error))
        {
            if (entity.Source == "CPT")
            {
                success = await _chargePayTransService.UpdateChargePayTransAsync(entity);
            }
            else if (entity.Source == "CCPT")
            {
                success = await _cummulativeChargePayTransService.UpdateCummulativeChargePayTransAsync(entity);
            }
        }

        return Ok(new ServerResponse { IsSuccess = success, Error = error });
    }

    // POST: api/chargeorder/cummulativeChargePayment
    [HttpPost("cummulativeChargePayment")]
    public async Task<ActionResult<ServerResponse>> CummulativeChargePayment([FromBody] CummulativeChargePayTrans entity)
    {
        var error = string.Empty;
        var success = false;

        try
        {
            if (entity.TransMode == 0)
            {
                if (string.IsNullOrWhiteSpace(entity.TransactionId))
                {
                    error = "Transaction Id can't be empty.";
                }
                else if (await _transNoEvaluator.IsTransactionIdExistAsync(entity.OrgId, entity.TransactionId, -1, string.Empty))
                {
                    error = "App alreadey contain entry with given Transaction ID. Can't be saved.";
                }
            }

            if (string.IsNullOrEmpty(error))
            {
                success = await _chargePayTransService.CummulativeChargePaymentAsync(entity);
            }
        }
        catch (Exception ex)
        {
            error = ex.Message;
        }

        return Ok(new ServerResponse { IsSuccess = success, Error = error });
    }
}
