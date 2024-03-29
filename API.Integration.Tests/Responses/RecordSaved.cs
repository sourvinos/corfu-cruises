using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace API.Integration.Tests.Responses {

    public static class RecordSaved {

        public static async Task Action<T>(HttpClient httpClient, string baseUrl, string url, string actionVerb, string username, string password, T record) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(username, password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = new HttpResponseMessage();
            switch (actionVerb) {
                case "post":
                    actionResponse = await httpClient.PostAsync(baseUrl + url, new StringContent(System.Text.Json.JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
                    break;
                case "put":
                    actionResponse = await httpClient.PutAsync(baseUrl + url, new StringContent(System.Text.Json.JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
                    break;
                case "patch":
                    actionResponse = await httpClient.PatchAsync(baseUrl + url, new StringContent(System.Text.Json.JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
                    break;
            }
            // cleanup
            await Helpers.Logout(httpClient, loginResponse.UserId);
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
        }

    }

}
