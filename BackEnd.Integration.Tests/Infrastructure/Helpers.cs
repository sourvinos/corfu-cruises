using System;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using BlueWaterCruises;

namespace BackEnd.IntegrationTests {

    public static class Helpers {

        private static Random random = new Random();

        public static TokenRequest CreateLoginCredentials(string username, string password, string grantType = "password") {
            TokenRequest credentials = new TokenRequest {
                Username = username,
                Password = password,
                GrantType = grantType
            };
            return credentials;
        }

        public static async Task<TokenResponse> Login(HttpClient httpClient, TokenRequest credentials) {
            HttpResponseMessage loginResponse = await httpClient.PostAsync("api/auth/auth", new StringContent(JsonSerializer.Serialize(credentials), Encoding.UTF8, MediaTypeNames.Application.Json));
            string loginResponseContent = await loginResponse.Content.ReadAsStringAsync();
            TokenResponse loginResult = JsonSerializer.Deserialize<TokenResponse>(loginResponseContent);
            return loginResult;
        }

        public static async Task Logout(HttpClient httpClient, User user) {
            await httpClient.PostAsync("api/auth/logout", new StringContent(JsonSerializer.Serialize(user), Encoding.UTF8, MediaTypeNames.Application.Json));
        }

        public static string CreateRandomString(int length) {
            return new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static HttpRequestMessage CreateRequest(string baseUrl, string userId, string url) {
            var request = new HttpRequestMessage {
                Method = HttpMethod.Get,
                RequestUri = new Uri(baseUrl + url),
                Content = new StringContent(JsonSerializer.Serialize(new User { UserId = userId }), Encoding.UTF8, MediaTypeNames.Application.Json)
            };
            return request;
        }

    }

}