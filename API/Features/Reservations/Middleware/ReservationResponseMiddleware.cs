using System;
using System.Threading.Tasks;
using API.Infrastructure.Helpers;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace API.Infrastructure.Responses {

    public class ReservationResponseMiddleware : IMiddleware {

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
            httpContext.Response.StatusCode = e.ResponseCode;
            httpContext.Response.ContentType = "application/json";
            var result = JsonConvert.SerializeObject(new Response {
                Code = e.ResponseCode,
                Icon = Icons.Error.ToString(),
                Message = GetErrorMessage(e.ResponseCode)
            });
            return httpContext.Response.WriteAsync(result);
        }

        private static Task CreateServerErrorResponse(HttpContext httpContext, Exception e) {
            httpContext.Response.StatusCode = 500;
            httpContext.Response.ContentType = "application/json";
            var result = JsonConvert.SerializeObject(new Response {
                Code = 500,
                Icon = Icons.Error.ToString(),
                Message = e.Message
            });
            return httpContext.Response.WriteAsync(result);
        }

        private static string GetErrorMessage(int httpResponseCode) {
            return httpResponseCode switch {
                409 => ApiMessages.DuplicateRecord(),
                450 => ApiMessages.InvalidCustomer(),
                451 => ApiMessages.InvalidDestination(),
                452 => ApiMessages.InvalidPickupPoint(),
                453 => ApiMessages.InvalidDriver(),
                454 => ApiMessages.InvalidShip(),
                456 => ApiMessages.InvalidNationality(),
                457 => ApiMessages.InvalidGender(),
                458 => ApiMessages.InvalidOccupant(),
                410 => ApiMessages.InvalidDateDestinationOrPort(),
                431 => ApiMessages.SimpleUserCanNotAddReservationAfterDepartureTime(),
                433 => ApiMessages.PortHasNoVacancy(),
                459 => ApiMessages.SimpleUserNightRestrictions(),
                455 => ApiMessages.InvalidPassengerCount(),
                490 => ApiMessages.NotOwnRecord(),
                491 => ApiMessages.RecordInUse(),
                _ => ApiMessages.UnknownError(),
            };
        }

    }

}