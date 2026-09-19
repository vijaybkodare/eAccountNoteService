using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Services;

public class PermissionService : IPermissionService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<PermissionService> _logger;

    public PermissionService(IConfiguration configuration, ILogger<PermissionService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public bool HasPermission(decimal roleId, string requiredPermission)
    {
        if (string.IsNullOrWhiteSpace(requiredPermission))
        {
            return true;
        }

        return HasPermission(roleId, new[] { requiredPermission });
    }

    public bool HasPermission(decimal roleId, IEnumerable<string> requiredPermissions)
    {
        if (requiredPermissions == null || !requiredPermissions.Any())
        {
            return true;
        }

        var rolePermissions = GetPermissionsForRole(roleId);
        if (rolePermissions == null || rolePermissions.Count == 0)
        {
            _logger.LogWarning("No permissions configured for RoleId {RoleId}", roleId);
            return false;
        }

        // 1. Universal wildcard grants access to everything
        if (rolePermissions.Contains("*"))
        {
            return true;
        }

        foreach (var req in requiredPermissions)
        {
            if (string.IsNullOrWhiteSpace(req))
            {
                continue;
            }

            // 2. Exact match (e.g. "org.create")
            if (rolePermissions.Contains(req, StringComparer.OrdinalIgnoreCase))
            {
                return true;
            }

            var parts = req.Split('.');
            if (parts.Length == 2)
            {
                var feature = parts[0];
                var action = parts[1];

                // 3. Feature wildcard: "feature.*" (e.g. "org.*" matches "org.create")
                if (rolePermissions.Contains($"{feature}.*", StringComparer.OrdinalIgnoreCase))
                {
                    return true;
                }

                // 4. Action wildcard: "*.action" (e.g. "*.view" matches "account.view")
                if (rolePermissions.Contains($"*.{action}", StringComparer.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
        }

        return false;
    }

    public IReadOnlyList<string> GetPermissionsForRole(decimal roleId)
    {
        var section = _configuration.GetSection("RolePermissions");
        if (!section.Exists())
        {
            _logger.LogWarning("Section 'RolePermissions' does not exist in configuration.");
            return Array.Empty<string>();
        }

        var candidateKeys = GetRoleCandidateKeys(roleId);
        foreach (var key in candidateKeys)
        {
            var roleSec = section.GetSection(key);
            if (roleSec.Exists())
            {
                var permissions = roleSec.Get<string[]>();
                if (permissions != null && permissions.Length > 0)
                {
                    return permissions;
                }
            }
        }

        return Array.Empty<string>();
    }

    private static string[] GetRoleCandidateKeys(decimal roleId) => roleId switch
    {
        100 => new[] { "100", "SuperAdmin", "Super Admin", "superadmin" },
        1 => new[] { "1", "Admin", "admin" },
        2 => new[] { "2", "NormalUser", "Normal User", "normaluser", "User", "user" },
        3 => new[] { "3", "Auditor", "auditor" },
        _ => new[] { roleId.ToString() }
    };
}
