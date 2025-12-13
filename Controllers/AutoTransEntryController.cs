using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AutoTransEntryController : ControllerBase
{
    private readonly MLAutoTransService _mlAutoTransService;
    private readonly MLAutoTrans2Service _mlAutoTrans2Service;
    private readonly AccountTransTokenService _accountTransTokenService;

    public AutoTransEntryController(
        MLAutoTransService mlAutoTransService,
        MLAutoTrans2Service mlAutoTrans2Service,
        AccountTransTokenService accountTransTokenService)
    {
        _mlAutoTransService = mlAutoTransService;
        _mlAutoTrans2Service = mlAutoTrans2Service;
        _accountTransTokenService = accountTransTokenService;
    }

    // POST: api/autotransentry/prepare
    [HttpPost("prepare")]
    public async Task<ActionResult<ServerResponse>> Prepare(
        [FromQuery] int orgId,
        [FromQuery] decimal accountId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate)
    {
        var map = await _mlAutoTransService.ProcessAutoTransAsync(orgId, accountId, fromDate, toDate);
        if (map != null)
        {
            await _mlAutoTransService.StoreAutoTransEntryAsync(orgId, map);
        }
        return Ok(new ServerResponse { IsSuccess = map != null });
    }

    // GET: api/autotransentry/report
    // NOTE: RDLC report generation is not implemented; this endpoint only confirms data exists.
    [HttpGet("report")]
    public async Task<ActionResult<IEnumerable<AutoTransEntry>>> GetReport([FromQuery] int orgId)
    {
        var data = await _mlAutoTransService.GetRecordsAsync(orgId);
        return Ok(data);
    }

    // GET: api/autotransentry/prepare (GET variant returning auto transactions)
    [HttpGet("prepare")]
    public async Task<ActionResult<List<AutoChargePayTrans>?>> GetAutoTransEntry(
        [FromQuery] int orgId,
        [FromQuery] decimal bankStatementHeaderId,
        [FromQuery] decimal accountId,
        [FromQuery] string fromDate,
        [FromQuery] string toDate)
    {
        var result = await _mlAutoTrans2Service.GetAutoTransAsync(orgId, bankStatementHeaderId, accountId, fromDate, toDate);
        return Ok(result);
    }

    // POST: api/autotransentry/addTransToken
    [HttpPost("addTransToken")]
    public async Task<ActionResult<ServerResponse>> AddTransToken(
        [FromQuery] int orgId,
        [FromQuery] decimal accountId,
        [FromQuery] int tokenTypeId,
        [FromQuery] string tokenValue,
        [FromQuery] int tokenWeight)
    {
        var entity = new AccountTransToken
        {
            AccountId = accountId,
            TokenTypeId = tokenTypeId,
            TokenValue = tokenValue,
            TokenWeight = tokenWeight
        };
        var success = await _accountTransTokenService.AddRecordAsync(entity);
        return Ok(new ServerResponse { IsSuccess = success });
    }

    // GET: api/autotransentry/getTransTokens
    [HttpGet("getTransTokens")]
    public async Task<ActionResult<IEnumerable<AccountTransToken>>> GetTransTokens([
        FromQuery] decimal accountId,
        [FromQuery] int orgId = -1)
    {
        var tokens = await _accountTransTokenService.GetTransTokensAsync(orgId, accountId);
        return Ok(tokens);
    }

    // GET: api/autotransentry/getTransTokenTypes
    [HttpGet("getTransTokenTypes")]
    public async Task<ActionResult<IEnumerable<AccountTransToken>>> GetTransTokenTypes()
    {
        var types = await _accountTransTokenService.GetTransTokenTypesAsync();
        return Ok(types);
    }

    // POST: api/autotransentry/delTransToken
    [HttpPost("delTransToken")]
    public async Task<ActionResult<ServerResponse>> DelTransToken([
        FromQuery] decimal accountId,
        [FromQuery] int tokenTypeId)
    {
        var success = await _accountTransTokenService.DeleteAsync(accountId, tokenTypeId);
        return Ok(new ServerResponse { IsSuccess = success });
    }

    // GET: api/autotransentry/getAccountListWithTokens
    [HttpGet("getAccountListWithTokens")]
    public async Task<ActionResult<IEnumerable<AccountDto>>> GetAccountListWithTokens([
        FromQuery] int orgId,
        [FromQuery] decimal accountId = -1)
    {
        var list = await _mlAutoTrans2Service.GetAccountDtosAsync(orgId, accountId, true);
        return Ok(list);
    }
}
