using System;
using Microsoft.AspNetCore.Mvc.Filters;

namespace eAccountNoteService.Filters;

/// <summary>
/// Use this attribute on controllers or actions to skip AuthActionFilter.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
public class SkipAuthFilterAttribute : Attribute, IFilterMetadata
{
}
