using eAccountNoteService.Models;
using eAccountNoteService.Services;
using eAccountNoteService.Utility;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChargeTransMapController : ControllerBase
    {
        private readonly ChargeTransMapService _chargeTransMapService;

        public ChargeTransMapController(ChargeTransMapService chargeTransMapService)
        {
            _chargeTransMapService = chargeTransMapService;
        }

        [HttpGet("bankstatements")]
        public async Task<ActionResult<IEnumerable<BankStatement>>> GetBankStatements(
            [FromQuery] decimal orgId,
            [FromQuery] string fromDate,
            [FromQuery] string toDate,
            [FromQuery] decimal accountId = -1)
        {
            var records = await _chargeTransMapService.GetBankStatementsAsync(orgId, fromDate, toDate, accountId);
            return Ok(records);
        }

        [HttpPost("mapchargetrans")]
        public async Task<ActionResult<ServerResponse>> MapChargeTrans(
            [FromBody] ChargeTransMap chargeTransMap)
        {
            await _chargeTransMapService.mapBankStatementToChargeTrans(chargeTransMap.BankStatementId, chargeTransMap.ChargePayTransId, chargeTransMap.Source);
            return Ok();
        }

        [HttpGet("chargetransactions")]
        public async Task<ActionResult<IEnumerable<ReconciliationItem>>> GetChargeTransactions(
            [FromQuery] decimal orgId,
            [FromQuery] decimal accountId,
            [FromQuery] string fromDate,
            [FromQuery] string toDate)
        {
            var records = await _chargeTransMapService.GetChargeTransactionsAsync(orgId, accountId, fromDate, toDate);
            return Ok(records);
        }
    }
}
