using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace API.Infrastructure.Middleware {

    public class ErrorHandlerMiddleware {

        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILoggerFactory loggerFactory) {
            _next = next;
            _logger = loggerFactory.CreateLogger<ErrorHandlerMiddleware>();
        }

        public async Task Invoke(HttpContext context) {
            try {
                await _next(context);
            } catch (Exception error) {
                var response = context.Response;
                response.ContentType = "application/json";
                response.StatusCode = error switch {
                    RecordNotFound => 404,
                    RecordIsInUse => 491,
                    _ => 500,
                };
                var result = JsonSerializer.Serialize(new { response = error?.Message });
                _logger.LogError("E R R O R: " + error);
                await response.WriteAsync(result);
            }

        }

    }

}