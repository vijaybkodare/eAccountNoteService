using System.Collections.Generic;

namespace eAccountNoteService.Services;

public interface IPermissionService
{
    bool HasPermission(decimal roleId, IEnumerable<string> requiredPermissions);
    bool HasPermission(decimal roleId, string requiredPermission);
    IReadOnlyList<string> GetPermissionsForRole(decimal roleId);
}
