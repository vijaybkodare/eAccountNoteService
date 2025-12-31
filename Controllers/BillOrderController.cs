using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("[controller]")]
public class BillOrderController : ControllerBase
{
    private readonly BillOrderService _billOrderService;
    private readonly BillPayTransService _billPayTransService;
    private readonly ILogger<BillOrderController> _logger;

    public BillOrderController(BillOrderService billOrderService, BillPayTransService billPayTransService, ILogger<BillOrderController> logger)
    {
        _billOrderService = billOrderService;
        _billPayTransService = billPayTransService;
        _logger = logger;
    }

    // GET: api/billorder/hello
    [HttpGet("hello")]
    public IActionResult Hello()
    {
        return Ok("Hi hello");
    }

    // GET: api/billorder/entity?billOrderId=0&orgId=1
    [HttpGet("entity")]
    public async Task<ActionResult<ServerResponse>> GetEntity([FromQuery] decimal billOrderId, [FromQuery] decimal orgId)
    {
        var entity = await _billOrderService.GetRecordAsync(billOrderId, orgId);
        return Ok(new ServerResponse { IsSuccess = true, Data = entity });
    }

    // POST: api/billorder/save
    [HttpPost("save")]
    public async Task<ActionResult<ServerResponse>> Save([FromForm] BillOrder entity)
    {
        var success = await _billOrderService.AddUpdateAsync(entity);
        return Ok(new ServerResponse { IsSuccess = success });
    }

    // GET: api/billorder/list?orgId=1
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<BillOrder>>> GetList([FromQuery] decimal orgId)
    {
        var list = await _billOrderService.GetRecordsAsync(orgId);
        return Ok(list);
    }

    // POST: api/billorder/billPayment
    [HttpPost("billPayment")]
    public async Task<ActionResult<ServerResponse>> BillPayment([FromBody] BillPayTrans entity)
    {
        if (entity.Remark == null) entity.Remark = string.Empty;

        var result = await _billPayTransService.AddAsync(entity);
        var response = new ServerResponse
        {
            IsSuccess = result.Success,
            Error = result.ErrorMessage
        };
        return Ok(response);
    }

    // POST: api/billorder/saveBillFile
    [HttpPost("saveBillFile")]
    public async Task<ActionResult<ServerResponse>> SaveBillFile(
        [FromQuery] decimal orgId,
        [FromQuery] decimal billOrderId,
        IFormFile file)
    {
        try
        {
            var success = await _billOrderService.SaveBillFileAsync(orgId, billOrderId, file);

            if (!success)
            {
                _logger.LogWarning(
                    "Failed to save bill file for OrgId {OrgId}, BillOrderId {BillOrderId}, FileName {FileName}",
                    orgId,
                    billOrderId,
                    file?.FileName);
            }

            return Ok(new ServerResponse
            {
                IsSuccess = success,
                Error = success ? string.Empty : "Failed to save bill file.",
                Data = null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Unhandled exception in SaveBillFile for OrgId {OrgId}, BillOrderId {BillOrderId}, FileName {FileName}",
                orgId,
                billOrderId,
                file?.FileName);

            throw;
        }
    }
    [HttpGet("billtransactions")]
    public async Task<ActionResult<IEnumerable<BillPayTrans>>> GetBillTransactions(
            [FromQuery] decimal orgId,
            [FromQuery] decimal accountId,
            [FromQuery] string fromDate,
            [FromQuery] string toDate)
    {
        var records = await _billPayTransService.getRecordsAsync(
            orgId: orgId,
            accountId: accountId,
            fromDate: fromDate,
            toDate: toDate,
            status: -1,
            reconcStatus: -1);

        return Ok(records);
    }
}
