using eAccountNoteService.Models;
using eAccountNoteService.Services;
using eAccountNoteService.Utility;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationController : ControllerBase
{
    private readonly DonationService _service;
    private readonly TransNoEvaluator _transNoEvaluator;

    public DonationController(DonationService service, TransNoEvaluator transNoEvaluator)
    {
        _service = service;
        _transNoEvaluator = transNoEvaluator;
    }

    // GET: /Donation/list?orgId=1
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<DonationHeader>>> GetList([FromQuery] decimal orgId)
    {
        var list = await _service.GetRecordsAsync(orgId);
        return Ok(list);
    }

    // GET: /Donation/detailList?orgId=1&donationHeaderId=1
    [HttpGet("detailList")]
    public async Task<ActionResult<IEnumerable<DonationDetail>>> GetDetailList([FromQuery] decimal orgId, [FromQuery] decimal donationHeaderId)
    {
        var list = await _service.GetDetailRecordsAsync(orgId, donationHeaderId);
        return Ok(list);
    }

    // GET: /Donation/entity?id=1&orgId=1
    [HttpGet("entity")]
    public async Task<ActionResult<DonationHeader>> Entity([FromQuery] decimal id, [FromQuery] decimal orgId)
    {
        var entity = await _service.GetRecordAsync(id, orgId);
        return Ok(entity);
    }

    // POST: /Donation/save
    [HttpPost("save")]
    public async Task<ActionResult<bool>> Save([FromBody] DonationHeader entity)
    {
        var success = await _service.AddOrUpdateAsync(entity);
        return Ok(success);
    }

    // POST: /Donation/addDonationDetail
    [HttpPost("addDonationDetail")]
    public async Task<ActionResult<ServerResponse>> AddDonationDetail([FromBody] DonationDetail entity)
    {
        var error = string.Empty;
        var success = false;

        try
        {
            if (entity.TransMode == 0)
            {
                if (string.IsNullOrWhiteSpace(entity.TransactionId))
                {
                    error = "Transaction Id can't be empty.";
                }
                else if (await _transNoEvaluator.IsTransactionIdExistAsync(entity.OrgId, entity.TransactionId, -1, string.Empty))
                {
                    error = "App alreadey contain entry with given Transaction ID. Can't be saved.";
                }
            }

            if (string.IsNullOrEmpty(error))
            {
                success = await _service.AddDonationTransAsync(entity);
            }
        }
        catch (Exception ex)
        {
            error = ex.Message;
        }

        return Ok(new ServerResponse { IsSuccess = success, Error = error });
    }
}
