using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace API.Infrastructure.Middleware {

    public class ErrorHandlerMiddleware {

        private readonly RequestDelegate _next;

        public ErrorHandlerMiddleware(RequestDelegate next) {
            _next = next;
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
                await response.WriteAsync(result);
            }
        }

    }

}