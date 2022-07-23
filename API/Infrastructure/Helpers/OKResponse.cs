using API.Infrastructure.Responses;

namespace API.Infrastructure.Helpers {

    public static class ApiResponses {

        public static Response OK() {
            return new Response {
                StatusCode = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        public static Response NotFound() {
            return new Response {
                StatusCode = 404,
                Icon = Icons.Warning.ToString(),
                Message = ApiMessages.RecordNotFound()
            };

        }

    }

}