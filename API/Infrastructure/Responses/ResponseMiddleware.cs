using System;
using System.Threading.Tasks;
using API.Infrastructure.Helpers;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace API.Infrastructure.Responses {

    public class ResponseMiddleware : IMiddleware {

        public async Task InvokeAsync(HttpContext httpContext, RequestDelegate next) {
            try {
                await next(httpContext);
            } catch (CustomException exception) {
                await CreateCustomErrorResponse(httpContext, exception);
            } catch (Exception exception) {
                await CreateServerErrorResponse(httpContext, exception);
            }
        }

        private static Task CreateCustomErrorResponse(HttpContext httpContext, CustomException e) {
            httpContext.Response.StatusCode = e.HttpResponseCode;
            httpContext.Response.ContentType = "application/json";
            var result = JsonConvert.SerializeObject(new Response {
                StatusCode = e.HttpResponseCode,
                Icon = Icons.Error.ToString(),
                Message = e.HttpResponseCode == 404 ? ApiMessages.RecordNotFound() : ApiMessages.RecordInUse()
            });
            return httpContext.Response.WriteAsync(result);
        }

        private static Task CreateServerErrorResponse(HttpContext httpContext, Exception e) {
            httpContext.Response.StatusCode = 500;
            httpContext.Response.ContentType = "application/json";
            var result = JsonConvert.SerializeObject(new Response {
                StatusCode = 500,
                Icon = Icons.Error.ToString(),
                Message = e.Message
            });
            return httpContext.Response.WriteAsync(result);
        }

    }

}