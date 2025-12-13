using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BankStatementController : ControllerBase
{
    private readonly BankStatementHeaderService _headerService;
    private readonly BankStatementService _statementService;

    public BankStatementController(BankStatementHeaderService headerService, BankStatementService statementService)
    {
        _headerService = headerService;
        _statementService = statementService;
    }

    // GET: api/bankstatement/list?orgId=1
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<BankStatementHeader>>> GetList([FromQuery] decimal orgId)
    {
        var data = await _headerService.GetRecordsAsync(orgId);
        return Ok(data);
    }

    // GET: api/bankstatement/entity?id=1&orgId=1
    [HttpGet("entity")]
    public async Task<ActionResult<BankStatementHeader>> GetEntity([FromQuery] decimal id, [FromQuery] decimal orgId)
    {
        var entity = await _headerService.GetRecordAsync(id, orgId);
        return Ok(entity);
    }

    // GET: api/bankstatement/report?id=1&orgId=1
    // Returns the underlying bank statement records for the header.
    [HttpGet("report")]
    public async Task<ActionResult<IEnumerable<BankStatement>>> GetReport([FromQuery] decimal id, [FromQuery] decimal orgId)
    {
        var data = await _statementService.GetRecordsAsync(id, orgId, null, null, -1, null);
        return Ok(data);
    }

    // GET: api/bankstatement/bankstatementrep?orgId=1&fromDate=...&toDate=...
    [HttpGet("bankstatementrep")]
    public async Task<ActionResult<IEnumerable<BankStatement>>> GetBankStatementRep([FromQuery] decimal orgId, [FromQuery] string? fromDate, [FromQuery] string? toDate)
    {
        var data = await _statementService.GetRecordsAsync(-1, orgId, fromDate, toDate, -1, null);
        return Ok(data);
    }

    // GET: api/bankstatement/bankstatement?id=1&orgId=1&fromDate=...&toDate=...&remark=...
    [HttpGet("bankstatement")]
    public async Task<ActionResult<IEnumerable<BankStatement>>> GetBankStatement([FromQuery] decimal id, [FromQuery] decimal orgId, [FromQuery] string? fromDate, [FromQuery] string? toDate, [FromQuery] string? remark)
    {
        var data = await _statementService.GetRecordsAsync(id, orgId, fromDate, toDate, -1, remark);
        return Ok(data);
    }

    // POST: api/bankstatement/save
    // File upload/import is not implemented yet; this action returns a failure response.
    [HttpPost("save")]
    public ActionResult<ServerResponse> Save([FromQuery] int id, [FromQuery] int orgId, [FromQuery] string fromDate, [FromQuery] string toDate, [FromQuery] string remark, [FromQuery] string worksheetName)
    {
        return Ok(new ServerResponse
        {
            IsSuccess = false,
            Error = "Bank statement import from Excel is not implemented in this API.",
            Data = null
        });
    }

    // GET: api/bankstatement/statements?orgId=1&fromDate=...&toDate=...&status=0&remark=...
    [HttpGet("statements")]
    public async Task<ActionResult<IEnumerable<BankStatement>>> GetStatements([FromQuery] decimal orgId, [FromQuery] string? fromDate, [FromQuery] string? toDate, [FromQuery] int status, [FromQuery] string? remark)
    {
        var data = await _statementService.GetRecordsAsync(-1, orgId, fromDate, toDate, status, remark);
        return Ok(data);
    }
}
