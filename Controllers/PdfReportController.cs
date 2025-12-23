using System.IO;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PdfReportController : ControllerBase
{
    private readonly BillPayTransService _billPayTransService;
    private readonly ChargePayeeDetailService _chargePayeeDetailService;
    private readonly IWebHostEnvironment _env;

    public PdfReportController(
        BillPayTransService billPayTransService,
        ChargePayeeDetailService chargePayeeDetailService,
        IWebHostEnvironment env)
    {
        _billPayTransService = billPayTransService;
        _chargePayeeDetailService = chargePayeeDetailService;
        _env = env;
    }

    // GET: api/pdfreport/accounts?orgId=1
    [HttpGet("accounts")]
    public async Task<FileContentResult> GetAccounts([FromQuery] decimal orgId)
    {
        var result = await _chargePayeeDetailService.GenerateAccountsReportPdfAsync(orgId);

        return File(result.Content, "application/pdf", result.FileName);
    }

    // GET: api/pdfreport/expense-report?orgId=1&accountId=1&fromDate=2024-01-01&toDate=2024-12-31
    [HttpGet("expense-report")]
    public async Task<FileContentResult> GetExpenseReport(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate)
    {
        var reportPath = Path.Combine(_env.ContentRootPath, "Reports", "ExpenseReport.frx");
        var result = await _billPayTransService.GenerateExpenseReportPdfAsync(
            orgId,
            accountId,
            fromDate,
            toDate,
            reportPath);

        return File(result.Content, "application/pdf", result.FileName);
    }
}
