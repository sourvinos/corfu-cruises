using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace API.Integration.Tests.Responses {

    public static class RecordInUse {

        public static async Task Action(HttpClient httpClient, string baseUrl, string url, string username, string password) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(username, password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = await httpClient.DeleteAsync(baseUrl + url);
            // cleanup
            await Helpers.Logout(httpClient, loginResponse.UserId);
            // assert
            Assert.Equal((HttpStatusCode)491, actionResponse.StatusCode);
        }

    }

}
