using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace API.Integration.Tests.Responses {

    public static class List {

        public static async Task<HttpResponseMessage> Action(HttpClient httpClient, string baseUrl, string url, string username, string password) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(username, password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(baseUrl, url);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            // cleanup
            await Helpers.Logout(httpClient, loginResponse.UserId);
            // return
            return actionResponse;
        }

    }

}
