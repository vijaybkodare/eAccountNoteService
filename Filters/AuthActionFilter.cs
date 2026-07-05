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
    private readonly TokenService _tokenService;
    private readonly DapperService _dapperService;
    private readonly ILogger<AuthActionFilter> _logger;

    public AuthActionFilter(TokenService tokenService, DapperService dapperService, ILogger<AuthActionFilter> logger)
    {
        _tokenService = tokenService;
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

        if (Utility.AppConstants.useBearerToken)
        {
            if (!ValidateBearerToken(context))
            {
                return;
            }
        }
        else
        {
            if (!await ValidateAccessKeyAsync(context))
            {
                return;
            }
        }

        await next();
    }

    private bool ValidateBearerToken(ActionExecutingContext context)
    {
        var request = context.HttpContext.Request;
        string? token = null;

        // 1. Try Authorization header
        if (request.Headers.TryGetValue("Authorization", out var authHeaderValues))
        {
            var authHeader = authHeaderValues.ToString();
            if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                token = authHeader.Substring("Bearer ".Length).Trim();
            }
        }

        // 2. Fallback to accesskey header
        if (string.IsNullOrEmpty(token) && request.Headers.TryGetValue("accesskey", out var accessKeyValues))
        {
            var accessKey = accessKeyValues.ToString();
            if (accessKey.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                token = accessKey.Substring("Bearer ".Length).Trim();
            }
            else
            {
                token = accessKey;
            }
        }

        if (string.IsNullOrEmpty(token))
        {
            context.Result = new UnauthorizedResult();
            return false;
        }

        try
        {
            var claims = _tokenService.ValidateToken(token);
            if (claims == null)
            {
                context.Result = new UnauthorizedResult();
                return false;
            }

            // Consistency check for optional userid header
            if (request.Headers.TryGetValue("userid", out var userIdValues) &&
                decimal.TryParse(userIdValues.ToString(), out var userId) &&
                claims.UserId != userId)
            {
                _logger.LogWarning("User mismatch. Token User: {TokenUser}, Header User: {HeaderUser}", claims.UserId, userId);
                context.Result = new UnauthorizedResult();
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating Bearer token");
            context.Result = new UnauthorizedResult();
            return false;
        }

        return true;
    }

    private async Task<bool> ValidateAccessKeyAsync(ActionExecutingContext context)
    {
        var request = context.HttpContext.Request;

        // Old database-based check
        if (!request.Headers.TryGetValue("accesskey", out var accessKeyValues) ||
            !request.Headers.TryGetValue("userid", out var userIdValues))
        {
            context.Result = new UnauthorizedResult();
            return false;
        }

        var accessKey = accessKeyValues.ToString();
        if (!decimal.TryParse(userIdValues.ToString(), out var userId))
        {
            context.Result = new UnauthorizedResult();
            return false;
        }

        try
        {
            const string sql = "SELECT dbo.IsValidAccessKey(@UserId, @AccessKey)";
            var isValid = await _dapperService.QuerySingleOrDefaultAsync<int>(sql, new { UserId = userId, AccessKey = accessKey });
            if (isValid != 1)
            {
                context.Result = new UnauthorizedResult();
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating access key for user {UserId}", userId);
            context.Result = new UnauthorizedResult();
            return false;
        }

        return true;
    }
}
