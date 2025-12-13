using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JVOrderController : ControllerBase
{
    private readonly JVOrderService _service;

    public JVOrderController(JVOrderService service)
    {
        _service = service;
    }

    // GET: api/jvorder/hello
    [HttpGet("hello")]
    public IActionResult Hello()
    {
        return Ok("Hi hello");
    }

    // GET: api/jvorder/entity?orgId=1
    [HttpGet("entity")]
    public async Task<ActionResult<ServerResponse>> GetEntity([FromQuery] decimal orgId)
    {
        var entity = await _service.GetRecordAsync(orgId);
        return Ok(new ServerResponse { IsSuccess = true, Data = entity });
    }

    // GET: api/jvorder/list?orgId=1
    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<JVOrder>>> GetList([FromQuery] decimal orgId)
    {
        var list = await _service.GetRecordsAsync(orgId);
        return Ok(list);
    }

    // POST: api/jvorder/save
    // NOTE: In the legacy code this also creates Transaction rows in a DB transaction.
    // Here we only save the JVOrder itself; transaction posting is not implemented yet.
    [HttpPost("save")]
    public async Task<ActionResult<ServerResponse>> Save([FromBody] JVOrder entity)
    {
        var result = await _service.AddAsync(entity);
        return Ok(new ServerResponse { IsSuccess = result.Success, Error = result.ErrorMessage });
    }
}
