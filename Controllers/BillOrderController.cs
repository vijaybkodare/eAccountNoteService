using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BillOrderController : ControllerBase
{
    private readonly BillOrderService _billOrderService;
    private readonly BillPayTransService _billPayTransService;

    public BillOrderController(BillOrderService billOrderService, BillPayTransService billPayTransService)
    {
        _billOrderService = billOrderService;
        _billPayTransService = billPayTransService;
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
    public async Task<ActionResult<ServerResponse>> Save([FromBody] BillOrder entity)
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
    // NOTE: File saving is not implemented yet; this is a stub that always returns failure if no file.
    [HttpPost("saveBillFile")]
    public ActionResult<ServerResponse> SaveBillFile([FromQuery] decimal orgId, [FromQuery] decimal billOrderId)
    {
        // Placeholder: no actual file handling implemented.
        return Ok(new ServerResponse { IsSuccess = false, Error = "File upload not implemented in this API yet.", Data = null });
    }
}
