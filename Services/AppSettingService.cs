using System.Data;
using Dapper;
using eAccountNoteService.Models;

namespace eAccountNoteService.Services;

public class AppSettingService
{
    private readonly DapperService _dapperService;

    public AppSettingService(DapperService dapperService)
    {
        _dapperService = dapperService;
    }

    public async Task<decimal> GetNumberValueAsync(decimal orgId, string appSettingCode)
    {
        var entity = await GetRecordAsync(orgId, appSettingCode);
        if (entity == null || string.IsNullOrWhiteSpace(entity.AppSettingVal))
            return 0m;

        return decimal.TryParse(entity.AppSettingVal, out var val) ? val : 0m;
    }

    public async Task<string> GetStringValueAsync(decimal orgId, string appSettingCode)
    {
        var entity = await GetRecordAsync(orgId, appSettingCode);
        return entity?.AppSettingVal ?? string.Empty;
    }

    public async Task<AppSetting?> GetRecordAsync(decimal orgId, string appSettingCode)
    {
        if (string.IsNullOrWhiteSpace(appSettingCode)) return null;

        const string sql = @"SELECT AppSettingCode, AppSettingVal, AppSettingDesc
                             FROM AppSetting
                             WHERE OrgId = @OrgId AND AppSettingCode = @AppSettingCode";

        return await _dapperService.QuerySingleOrDefaultAsync<AppSetting>(sql, new { OrgId = orgId, AppSettingCode = appSettingCode });
    }
}
