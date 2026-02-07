using eAccountNoteService.Models;
using eAccountNoteService.Services;
using eAccountNoteService.Utility;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BillTransMapController : ControllerBase
    {
        private readonly BankStatementService _bankStatementService;
        private readonly BillPayTransService _billPayTransService;
        private readonly BillTransMapService _billTransMapService;

        public BillTransMapController(
            BankStatementService bankStatementService,
            BillPayTransService billPayTransService,
            BillTransMapService billTransMapService)
        {
            _bankStatementService = bankStatementService;
            _billPayTransService = billPayTransService;
            _billTransMapService = billTransMapService;
        }

        [HttpGet("bankstatements")]
        public async Task<ActionResult<IEnumerable<BankStatement>>> GetBankStatements(
            [FromQuery] decimal orgId,
            [FromQuery] string fromDate,
            [FromQuery] string toDate)
        {
            var records = await _bankStatementService.GetRecordsAsync(
                id: -1,
                orgId: orgId,
                fromDate: fromDate,
                toDate: toDate,
                status: 0,
                remark: null,
                amountFlag: -1);

            return Ok(records);
        }

        [HttpPost("mapbilltrans")]
        public async Task<ActionResult<ServerResponse>> MapBillTrans(
            [FromBody] BillTransMap billTransMap)
        {
            await _billTransMapService.mapBankStatementToBillTrans(billTransMap.BankStatementId, billTransMap.BillPayTransId);
            return Ok();
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
                status: 0,
                reconcStatus: 0);

            return Ok(records);
        }
    }
}
