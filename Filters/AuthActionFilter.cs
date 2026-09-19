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
    private readonly IPermissionService _permissionService;
    private readonly ILogger<AuthActionFilter> _logger;

    public AuthActionFilter(
        TokenService tokenService, 
        DapperService dapperService, 
        IPermissionService permissionService,
        ILogger<AuthActionFilter> logger)
    {
        _tokenService = tokenService;
        _dapperService = dapperService;
        _permissionService = permissionService;
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

        // Evaluate endpoint permission if required
        var permissionAttr = context.ActionDescriptor.EndpointMetadata.OfType<RequiresPermissionAttribute>().FirstOrDefault();
        if (permissionAttr != null && permissionAttr.Permissions != null && permissionAttr.Permissions.Length > 0)
        {
            decimal roleId = 0;
            if (context.HttpContext.Items.TryGetValue("RoleId", out var roleIdObj) && roleIdObj is decimal rid)
            {
                roleId = rid;
            }

            if (!_permissionService.HasPermission(roleId, permissionAttr.Permissions))
            {
                _logger.LogWarning("Forbidden: Role {RoleId} lacks permissions [{Permissions}] for path {Path}",
                    roleId, string.Join(", ", permissionAttr.Permissions), request.Path);

                context.Result = new ObjectResult(new Models.ServerResponse
                {
                    IsSuccess = false,
                    Error = "Access denied: insufficient permissions for this operation."
                })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
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

            // Store claims in HttpContext for downstream usage
            context.HttpContext.Items["TokenClaims"] = claims;
            context.HttpContext.Items["UserId"] = claims.UserId;
            context.HttpContext.Items["OrgId"] = claims.OrgId;
            context.HttpContext.Items["RoleId"] = claims.RoleId;
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

            const string roleSql = @"
                SELECT TOP 1 UPR.RoleId
                FROM UserProfile UP
                INNER JOIN UserProfileRole UPR ON UP.ProfileId = UPR.UserProfileId
                WHERE UP.UserId = @UserId
                ORDER BY UPR.RoleId DESC";
            var roleId = await _dapperService.QuerySingleOrDefaultAsync<decimal?>(roleSql, new { UserId = userId }) ?? 2;
            context.HttpContext.Items["UserId"] = userId;
            context.HttpContext.Items["RoleId"] = roleId;
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
