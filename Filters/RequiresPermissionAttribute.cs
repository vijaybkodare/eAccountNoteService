using System;

namespace eAccountNoteService.Filters;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
public class RequiresPermissionAttribute : Attribute
{
    public string[] Permissions { get; }

    public RequiresPermissionAttribute(params string[] permissions)
    {
        Permissions = permissions ?? Array.Empty<string>();
    }
}
