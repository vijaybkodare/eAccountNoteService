using eAccountNoteService.Models;
using eAccountNoteService.Services;
using eAccountNoteService.Utility;
using Microsoft.AspNetCore.Http;
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
    // Returns a PDF report for the specified bank statement header.
    [HttpGet("report")]
    public async Task<FileContentResult> GetReport([FromQuery] decimal id, [FromQuery] decimal orgId)
    {
        var result = await _statementService.GenerateSingleBankStatementReportPdfAsync(id, orgId);

        return File(result.Content, "application/pdf", result.FileName);
    }

    // GET: api/bankstatement/bankstatementrep?orgId=1&fromDate=...&toDate=...
    // Returns a PDF bank statement report for the given date range.
    [HttpGet("bankstatementrep")]
    public async Task<FileContentResult> GetBankStatementRep([FromQuery] decimal orgId, [FromQuery] string fromDate, [FromQuery] string toDate)
    {
        var result = await _statementService.GenerateBankStatementReportPdfAsync(orgId, fromDate, toDate);

        return File(result.Content, "application/pdf", result.FileName);
    }

    // GET: api/bankstatement/bankstatement?id=1&orgId=1&fromDate=...&toDate=...&remark=...
    [HttpGet("bankstatement")]
    public async Task<ActionResult<IEnumerable<BankStatement>>> GetBankStatement([FromQuery] decimal id, [FromQuery] decimal orgId, [FromQuery] string? fromDate, [FromQuery] string? toDate, [FromQuery] string? remark)
    {
        var data = await _statementService.GetRecordsAsync(id, orgId, fromDate, toDate, -1, remark);
        return Ok(data);
    }

    // POST: api/bankstatement/save
    [HttpPost("save")]
    public async Task<bool> Save(
        [FromQuery] decimal id,
        [FromQuery] decimal orgId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate,
        [FromQuery] string remark,
        [FromQuery] string worksheetName,
        IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new InvalidOperationException("No file uploaded.");
        }

        var header = new BankStatementHeader
        {
            BankStatementHeaderId = (int)id,
            OrgId = (int)orgId,
            FromDt = DateTime.Parse(fromDate),
            ToDt = DateTime.Parse(toDate),
            Remark = remark ?? string.Empty,
            WorksheetName = worksheetName ?? string.Empty,
            AddedDt = DateTime.Now
        };

        using var stream = file.OpenReadStream();
        var success = await _headerService.UploadBankStatementAsync(header, stream);

        if (!success)
        {
            throw new InvalidOperationException("Failed to import bank statement from Excel.");
        }

        return true;
    }

    // GET: api/bankstatement/statements?orgId=1&fromDate=...&toDate=...&status=0&remark=...
    [HttpGet("statements")]
    public async Task<ActionResult<IEnumerable<BankStatement>>> GetStatements([FromQuery] decimal orgId, [FromQuery] string? fromDate, [FromQuery] string? toDate, [FromQuery] int status, [FromQuery] string? remark)
    {
        var data = await _statementService.GetRecordsAsync(-1, orgId, fromDate, toDate, status, remark);
        return Ok(data);
    }
}
