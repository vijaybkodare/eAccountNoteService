using eAccountNoteService.Models;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Mvc;

namespace eAccountNoteService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppSettingController : ControllerBase
{
    private readonly AppSettingService _appSettingService;
    private readonly ItemMasterService _itemMasterService;

    public AppSettingController(AppSettingService appSettingService, ItemMasterService itemMasterService)
    {
        _appSettingService = appSettingService;
        _itemMasterService = itemMasterService;
    }

    // GET: api/appsetting/monthly_maintainance_item?orgId=1
    [HttpGet("monthly_maintainance_item")]
    public async Task<ActionResult<ItemMaster>> GetMonthlyMaintainanceItem([FromQuery] decimal orgId)
    {
        // Get app setting value
        var appSetting = await _appSettingService.GetRecordAsync(orgId, "MonthlyMaintainanceItem");
        if (appSetting == null || string.IsNullOrWhiteSpace(appSetting.AppSettingVal))
        {
            return NotFound("MonthlyMaintainanceItem setting not found");
        }

        if (!int.TryParse(appSetting.AppSettingVal, out var itemId))
        {
            return BadRequest("Invalid MonthlyMaintainanceItem value");
        }

        var item = await _itemMasterService.GetRecordByIdAsync(itemId);
        if (item == null)
        {
            return NotFound("Item not found");
        }

        return Ok(item);
    }
}
