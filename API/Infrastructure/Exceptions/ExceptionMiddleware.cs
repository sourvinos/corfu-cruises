using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace API.Infrastructure.Exceptions {

    public class ExceptionMiddleware : IMiddleware {

        public async Task InvokeAsync(HttpContext httpContext, RequestDelegate next) {
            try {
                await next(httpContext);
            } catch (CustomException exception) {
                await CreateCustomErrorResponse(httpContext, exception);
            } catch (DbUpdateConcurrencyException exception) {
                await CreateDBUpdateErrorResponse(httpContext, exception);
            } catch (Exception exception) {
                await CreateServerErrorResponse(httpContext, exception);
            }
        }

        private static async Task CreateCustomErrorResponse(HttpContext httpcontext, CustomException e) {
            var message = new ErrorResponse {
                StatusCode = e.HttpResponseCode,
                Message = "This entity was either not found or can't be deleted because it's in use."
            };
            await httpcontext.Response.WriteAsJsonAsync(message);
        }

        private static async Task CreateDBUpdateErrorResponse(HttpContext httpcontext, DbUpdateConcurrencyException e) {
            var message = new ErrorResponse {
                StatusCode = 500,
                Message = e.Message
            };
            await httpcontext.Response.WriteAsJsonAsync(message);
        }

        private static async Task CreateServerErrorResponse(HttpContext httpcontext, Exception e) {
            var message = new ErrorResponse {
                StatusCode = 500,
                Message = e.Message
            };
            await httpcontext.Response.WriteAsJsonAsync(message);
        }

    }

}