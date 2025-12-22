using eAccountNoteService.Models;
using eAccountNoteService.Services;
using eAccountNoteService.Utility;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Linq;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    private readonly ChargeOrderService _chargeOrderService;
    private readonly ChargePayTransService _chargePayTransService;
    private readonly ChargePayeeDetailService _chargePayeeDetailService;
    private readonly AccountMasterService _accountMasterService;
    private readonly BillOrderService _billOrderService;
    private readonly BankStatementService _bankStatementService;
    private readonly TransNoEvaluator _transNoEvaluator;
    private readonly TransactionService _transactionService;

    public ReportController(
        ChargeOrderService chargeOrderService,
        ChargePayTransService chargePayTransService,
        ChargePayeeDetailService chargePayeeDetailService,
        AccountMasterService accountMasterService,
        BillOrderService billOrderService,
        BankStatementService bankStatementService,
        TransNoEvaluator transNoEvaluator,
        TransactionService transactionService)
    {
        _chargeOrderService = chargeOrderService;
        _chargePayTransService = chargePayTransService;
        _chargePayeeDetailService = chargePayeeDetailService;
        _accountMasterService = accountMasterService;
        _billOrderService = billOrderService;
        _bankStatementService = bankStatementService;
        _transNoEvaluator = transNoEvaluator;
        _transactionService = transactionService;
    }

    // GET: api/report/chargeOrderSummary?orgId=1&fromDate=...&toDate=...
    [HttpGet("chargeOrderSummary")]
    public async Task<ActionResult<ServerResponse>> ChargeOrderSummary([FromQuery] decimal orgId, [FromQuery] string fromDate, [FromQuery] string toDate)
    {
        var data = await _chargeOrderService.GetOrderSummaryAsync(orgId, fromDate, toDate);
        return Ok(new ServerResponse { IsSuccess = true, Data = data });
    }

    // GET: api/report/incomeExpense?orgId=1&fromDate=...&toDate=...
    [HttpGet("incomeExpense")]
    public async Task<ActionResult<ServerResponse>> IncomeExpense([FromQuery] decimal orgId, [FromQuery] string fromDate, [FromQuery] string toDate)
    {
        var data = await _transactionService.GetIncomeExpenseAsync(orgId, fromDate, toDate);
        return Ok(new ServerResponse { IsSuccess = true, Data = data });
    }

    // GET: api/report/summaryData?orgId=1&fromDate=...&toDate=...
    [HttpGet("summaryData")]
    public async Task<ActionResult<ServerResponse>> SummaryData([FromQuery] decimal orgId, [FromQuery] string fromDate, [FromQuery] string toDate)
    {
        // Income/expense
        var incExp = await _transactionService.GetIncomeExpenseAsync(orgId, fromDate, toDate);

        // Charge order summary
        var chargeSummary = await _chargeOrderService.GetOrderSummaryAsync(orgId, fromDate, toDate);

        // Account summary (pending bills/charges + balance)
        var accountSummary = await _accountMasterService.GetAccountSummaryAsync((int)orgId);

        var summary = new SummaryData
        {
            TotalIncome = incExp.TotalIncome,
            TotalExpense = incExp.TotalExpense,
            TotalChargeAmount = chargeSummary.TotalChargeAmount,
            TotalChargePaid = chargeSummary.TotalChargePaid,
            TotalChargeUnpaid = accountSummary.PendingCharges,
            TotalBillUnpaid = accountSummary.PendingBills,
            TotalBalance = accountSummary.Balance
        };

        // Monthly income/expense for last 6 months up to now, mirroring legacy behavior
        var fromDt = DateTime.Now.AddMonths(-6);
        var toDt = DateTime.Now;
        summary.PeriodIncomeExpenses = (await _transactionService.GetMonthlyIncomeExpenseAsync(orgId, fromDt, toDt)).ToList();

        return Ok(new ServerResponse { IsSuccess = true, Data = summary });
    }

    // GET: api/report/chargePayTransRep?orgId=1&accountId=...&fromDate=...&toDate=...
    [HttpGet("chargePayTransRep")]
    public async Task<ActionResult<IEnumerable<ChargePayTrans>>> ChargePayTransRep([FromQuery] decimal orgId, [FromQuery] decimal accountId, [FromQuery] string fromDate, [FromQuery] string toDate)
    {
        // Legacy code used GetAllRecords and JSON roundtrip; here we directly return the records.
        var list = await _chargePayTransService.GetAllRecordsAsync(orgId, accountId, fromDate, toDate);
        return Ok(list);
    }

    // GET: api/report/chargePayAndCummTrans?orgId=1&accountId=...&fromDate=...&toDate=...
    [HttpGet("chargePayAndCummTrans")]
    public async Task<ActionResult<IEnumerable<ChargePayTrans>>> ChargePayAndCummTrans([FromQuery] decimal orgId, [FromQuery] decimal accountId, [FromQuery] string fromDate, [FromQuery] string toDate)
    {
        var list = await _chargePayTransService.GetRecordsAsync(orgId, status: -1, refId: -1, accountId, fromDate, toDate);
        return Ok(list);
    }

    // GET: api/report/chargePayeeItemRep?orgId=1&accountId=...&fromDate=...&toDate=...
    [HttpGet("chargePayeeItemRep")]
    public async Task<ActionResult<IEnumerable<ChargePayeeDetail>>> ChargePayeeItemRep([FromQuery] decimal orgId, [FromQuery] decimal accountId, [FromQuery] string fromDate, [FromQuery] string toDate)
    {
        var list = await _chargePayeeDetailService.GetRecordsAsync(orgId, accountId, fromDate, toDate);
        return Ok(list);
    }

    // GET: Report/memberAccountStatus?OrgId=1&accountId=-1
    [HttpGet("memberAccountStatus")]
    public async Task<ActionResult> MemberAccountStatus([FromQuery] decimal orgId, [FromQuery] decimal accountId = -1)
    {
        var dt = await _chargePayeeDetailService.GetMemberAccountStatusAsync(orgId, accountId);

        var items = dt.AsEnumerable()
            .Select((row, index) => new
            {
                SrNo = index + 1,
                AccountId = row.Field<decimal>("AccountId"),
                AccountName = row.Field<string>("AccountName") ?? string.Empty,
                Amount = row.Field<decimal?>("Amount") ?? 0m,
                PaidAmount = row.Field<decimal?>("PaidAmount") ?? 0m,
                PendingAmount = row.Field<decimal?>("PendingAmount") ?? 0m
            })
            .ToList();

        return Ok(items);
    }

    // GET: api/report/downloadChargePayTransRep?orgId=1&accountId=...&fromDate=...&toDate=...
    [HttpGet("downloadChargePayTransRep")]
    public async Task<IActionResult> DownloadChargePayTransRep([FromQuery] decimal orgId, [FromQuery] decimal accountId, [FromQuery] string fromDate, [FromQuery] string toDate)
    {
        var result = await _chargePayTransService.GenerateChargePayTransCsvAsync(orgId, accountId, fromDate, toDate);
        return File(result.Content, result.ContentType, result.FileName);
    }

    // GET: api/report/downloadMemberAccountStatus?orgId=1
    [HttpGet("downloadMemberAccountStatus")]
    public async Task<IActionResult> DownloadMemberAccountStatus([FromQuery] decimal orgId)
    {
        var result = await _chargePayeeDetailService.GenerateMemberAccountStatusCsvAsync(orgId);
        return File(result.Content, result.ContentType, result.FileName);
    }

    // GET: api/report/downloadBillReport?orgId=1
    [HttpGet("downloadBillReport")]
    public async Task<IActionResult> DownloadBillReport([FromQuery] decimal orgId)
    {
        var result = await _billOrderService.GenerateBillReportCsvAsync(orgId);
        return File(result.Content, result.ContentType, result.FileName);
    }

    // GET: api/report/getStatementInCsv?orgId=1&fromDate=...&toDate=...&status=0&remark=...
    [HttpGet("getStatementInCsv")]
    public async Task<IActionResult> GetStatementInCsv(
        [FromQuery] decimal orgId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate,
        [FromQuery] int status,
        [FromQuery] string? remark = null)
    {
        var result = await _bankStatementService.GenerateStatementCsvAsync(orgId, fromDate, toDate, status, remark);
        return File(result.Content, result.ContentType, result.FileName);
    }

    // GET: api/report/evaluateUtrNoAsTransNo?orgId=1&accountId=...&fromDate=...&toDate=...
    [HttpGet("evaluateUtrNoAsTransNo")]
    public async Task<ActionResult<ServerResponse>> EvaluateUtrNoAsTransNo(
        [FromQuery] decimal orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate)
    {
        try
        {
            await _transNoEvaluator.EvaluateUtrNoAsync(orgId, accountId, fromDate, toDate);
            return Ok(new ServerResponse { IsSuccess = true, Data = null });
        }
        catch (Exception ex)
        {
            return Ok(new ServerResponse { IsSuccess = false, Error = ex.Message });
        }
    }

    // NOTE: evaluateUtrNoAsTransNo depends on TransNoEvaluator, which is not yet migrated.
    // downloadChargePayTransRep, downloadMemberAccountStatus, downloadBillReport, getStatementInCsv
    // depend on specific download/CSV methods that may need async wrappers in the eAccountNoteService services.
}
