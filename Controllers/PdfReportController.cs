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
    private readonly ChargePayTransService _chargePayTransService;
    private readonly BillOrderService _billOrderService;
    private readonly ChargeOrderService _chargeOrderService;
    private readonly IWebHostEnvironment _env;

    public PdfReportController(
        BillPayTransService billPayTransService,
        ChargePayeeDetailService chargePayeeDetailService,
        BillOrderService billOrderService,
        ChargePayTransService chargePayTransService,
        ChargeOrderService chargeOrderService,
        IWebHostEnvironment env)
    {
        _billPayTransService = billPayTransService;
        _chargePayeeDetailService = chargePayeeDetailService;
        _billOrderService = billOrderService;
        _chargePayTransService = chargePayTransService;
        _chargeOrderService = chargeOrderService;
        _env = env;
    }

    // GET: api/pdfreport/accounts?orgId=1
    [HttpGet("accounts")]
    public async Task<FileContentResult> GetAccounts([FromQuery] decimal orgId)
    {
        var result = await _chargePayeeDetailService.GenerateAccountsReportPdfAsync(orgId);

        return File(result.Content, "application/pdf", result.FileName);
    }

    // GET: api/pdfreport/bills?orgId=1
    [HttpGet("bills")]
    public async Task<FileContentResult> GetBills([FromQuery] decimal orgId)
    {
        var result = await _billOrderService.GenerateBillReportPdfAsync(orgId);

        return File(result.Content, "application/pdf", result.FileName);
    }

    // GET: api/pdfreport/accountpendingsummary?orgId=1
    [HttpGet("accountpendingsummary")]
    public async Task<FileContentResult> GetAccountPendingSummary([FromQuery] decimal orgId)
    {
        var result = await _chargePayeeDetailService.GenerateAccountPendingSummaryReportPdfAsync(orgId);

        return File(result.Content, "application/pdf", result.FileName);
    }

    // GET: api/pdfreport/accountCharges?orgId=1&accountId=1&fromDate=2024-01-01&toDate=2024-12-31
    [HttpGet("accountCharges")]
    public async Task<FileContentResult> GetAccountCharges(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate)
    {
        var result = await _chargePayeeDetailService.GenerateAccountChargesReportPdfAsync(
            orgId,
            accountId,
            fromDate,
            toDate);

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
        var result = await _billPayTransService.GenerateExpenseReportPdfAsync(
            orgId,
            accountId,
            fromDate,
            toDate);

        return File(result.Content, "application/pdf", result.FileName);
    }

    // GET: api/pdfreport/chargeTrans?orgId=1&accountId=1&fromDate=2024-01-01&toDate=2024-12-31
    [HttpGet("chargeTrans")]
    public async Task<FileContentResult> GetChargeTrans(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate)
    {
        var result = await _chargePayTransService.GenerateChargeTransReportPdfAsync(
            orgId,
            accountId,
            fromDate,
            toDate);

        return File(result.Content, "application/pdf", result.FileName);
    }

    // GET: api/pdfreport/chargeOrder?orgId=1&chargeOrderId=1
    [HttpGet("chargeOrder")]
    public async Task<FileContentResult> GetChargeOrder(
        [FromQuery] decimal orgId,
        [FromQuery] decimal chargeOrderId)
    {
        var result = await _chargeOrderService.GenerateChargeOrderReportPdfAsync(orgId, chargeOrderId);

        return File(result.Content, "application/pdf", result.FileName);
    }

    // GET: api/pdfreport/chargeOrders?orgId=1&fromDate=2024-01-01&toDate=2024-12-31
    [HttpGet("chargeOrders")]
    public async Task<FileContentResult> GetChargeOrders(
        [FromQuery] decimal orgId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate)
    {
        var result = await _chargePayeeDetailService.GenerateChargeOrdersReportPdfAsync(orgId, fromDate, toDate);

        return File(result.Content, "application/pdf", result.FileName);
    }
}
