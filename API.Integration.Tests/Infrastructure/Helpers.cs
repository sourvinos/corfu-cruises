using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using API.Infrastructure.Auth;
using Newtonsoft.Json;
using Xunit;

namespace API.IntegrationTests.Infrastructure {

    public static class Helpers {

        private static readonly Random _random = new();

        public static TokenRequest CreateLoginCredentials(string username, string password, string grantType = "password") {
            return (TokenRequest)(new() {
                Username = username,
                Password = password,
                GrantType = grantType
            });
        }

        public static async Task<TokenResponse> Login(HttpClient httpClient, TokenRequest credentials) {
            HttpResponseMessage loginResponse = await httpClient.PostAsync("api/auth/auth", new StringContent(JsonConvert.SerializeObject(credentials), Encoding.UTF8, MediaTypeNames.Application.Json));
            string loginResponseContent = await loginResponse.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<TokenResponse>(loginResponseContent);
        }

        public static async Task Logout(HttpClient httpClient, string userId) {
            await httpClient.PostAsync("api/auth/logout", new StringContent(userId));
        }

        public static string CreateRandomString(int length) {
            return new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", length).Select(s => s[_random.Next(s.Length)]).ToArray());
        }

        public static HttpRequestMessage CreateRequest(string baseUrl, string url, string userId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx") {
            return new HttpRequestMessage {
                Method = HttpMethod.Get,
                RequestUri = new Uri(baseUrl + url),
                Content = new StringContent(userId)
            };
        }

        public static StringContent ConvertObjectToJson(object record) {
            return new StringContent(JsonConvert.SerializeObject(record), Encoding.UTF8, MediaTypeNames.Application.Json);
        }

        public static async Task Should_Return_Unauthorized_When_Not_Logged_In(HttpClient httpClient, string actionVerb, string baseUrl, string url) {
            var actionResponse = new HttpResponseMessage();
            switch (actionVerb) {
                case "get":
                    actionResponse = await httpClient.GetAsync(baseUrl + url);
                    break;
                case "delete":
                    actionResponse = await httpClient.DeleteAsync(baseUrl + url);
                    break;
            }
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

    }

}