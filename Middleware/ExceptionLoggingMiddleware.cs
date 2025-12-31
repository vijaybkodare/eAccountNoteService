using System.Net;
using System.Text.Json;
using eAccountNoteService.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace eAccountNoteService.Middleware
{
    public class ExceptionLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionLoggingMiddleware> _logger;

        public ExceptionLoggingMiddleware(RequestDelegate next, ILogger<ExceptionLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Unhandled exception while processing {Method} {Path}",
                    context.Request?.Method,
                    context.Request?.Path.Value);

                if (context.Response.HasStarted)
                {
                    // If the response has already started, we can't change it safely
                    throw;
                }

                context.Response.Clear();
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var payload = new ServerResponse
                {
                    IsSuccess = false,
                    Error = "An unexpected error occurred. Please contact support.",
                    Data = null
                };

                var json = JsonSerializer.Serialize(payload);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
