using System.Threading.Tasks;
using API.Infrastructure.Helpers;
using Microsoft.AspNetCore.Http;

namespace API.Infrastructure.Exceptions {

    public class ExceptionHandling : IMiddleware {

        public async Task InvokeAsync(HttpContext context, RequestDelegate next) {
            try {
                await next(context);
            } catch (CustomException e) {
                if (e.HttpResponseCode == 404) {
                    var message = CreateResponse(e.HttpResponseCode);
                    context.Response.StatusCode = message.StatusCode;
                    await context.Response.WriteAsJsonAsync(message);
                }
                if (e.HttpResponseCode == 491) {
                    var message = CreateResponse(e.HttpResponseCode);
                    context.Response.StatusCode = message.StatusCode;
                    await context.Response.WriteAsJsonAsync(message);
                }
            }
        }

        private static ErrorResponse CreateResponse(int httpErrorCode) {
            var message = new ErrorResponse {
                StatusCode = httpErrorCode,
                Message = ApiMessages.RecordNotFound()
            };
            return message;
        }

    }

}
