using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReconciliationController : ControllerBase
{
    private readonly ReconciliationService _reconciliationService;

    public ReconciliationController(ReconciliationService reconciliationService)
    {
        _reconciliationService = reconciliationService;
    }

    // POST: api/reconciliation/processreconciliation?orgId=1&accountId=...&fromDate=...&toDate=...&useStoredBankStatement=true
    [HttpPost("processreconciliation")]
    public async Task<FileContentResult> ProcessReconciliation(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate,
        [FromQuery] bool useStoredBankStatement,
        IFormFile? file)
    {
        // For now, we ignore the file and return the same reconciliation report PDF
        // regardless of whether stored bank statement or uploaded file is used.
        using var stream = file != null ? file.OpenReadStream() : Stream.Null;

        var result = await _reconciliationService.ProcessReconciliationAsync(
            orgId,
            accountId,
            fromDate,
            toDate,
            useStoredBankStatement,
            stream,
            file?.FileName);

        return File(result.Content, "application/pdf", result.FileName);
    }

    // GET: api/reconciliation/reconciliation?orgId=1&accountId=...&fromDate=...&toDate=...
    [HttpGet("reconciliation")]
    public async Task<ActionResult<IEnumerable<ReconciliationItem>>> GetReconciliation(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate)
    {
        var items = await _reconciliationService.GetRecordsAsync(orgId, accountId, fromDate, toDate, -1);
        return Ok(items);
    }

    // GET: api/reconciliation/reconciliationrep?orgId=1&accountId=...&fromDate=...&toDate=...
    [HttpGet("reconciliationrep")]
    public async Task<FileContentResult> GetReconciliationReport(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate)
    {
        var result = await _reconciliationService.GenerateReconciliationReportPdfAsync(orgId, accountId, fromDate, toDate);
        return File(result.Content, "application/pdf", result.FileName);
    }
}
