using System.Threading.Tasks;
using Dapper;
using eAccountNoteService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Filters;

public class AuthActionFilter : IAsyncActionFilter
{
    private readonly DapperService _dapperService;
    private readonly ILogger<AuthActionFilter> _logger;

    public AuthActionFilter(DapperService dapperService, ILogger<AuthActionFilter> logger)
    {
        _dapperService = dapperService;
        _logger = logger;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Skip auth if explicitly disabled on controller or action
        if (context.Filters.Any(f => f is SkipAuthFilterAttribute))
        {
            await next();
            return;
        }

        var request = context.HttpContext.Request;

        // Allow preflight
        if (HttpMethods.IsOptions(request.Method))
        {
            await next();
            return;
        }

        if (!request.Headers.TryGetValue("accesskey", out var accessKeyValues) ||
            !request.Headers.TryGetValue("userid", out var userIdValues))
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var accessKey = accessKeyValues.ToString();
        if (!decimal.TryParse(userIdValues.ToString(), out var userId))
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        try
        {
            const string sql = "SELECT dbo.IsValidAccessKey(@UserId, @AccessKey)";
            var isValid = await _dapperService.QuerySingleOrDefaultAsync<int>(sql, new { UserId = userId, AccessKey = accessKey });
            if (isValid != 1)
            {
                context.Result = new UnauthorizedResult();
                return;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating access key for user {UserId}", userId);
            context.Result = new UnauthorizedResult();
            return;
        }

        await next();
    }
}
