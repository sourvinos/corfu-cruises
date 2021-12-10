using System;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using BlueWaterCruises;
using Newtonsoft.Json;

namespace BackEnd.IntegrationTests {

    public static class Helpers {

        private static readonly Random random = new();

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

        public static async Task Logout(HttpClient httpClient, User user) {
            await httpClient.PostAsync("api/auth/logout", new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, MediaTypeNames.Application.Json));
        }

        public static string CreateRandomString(int length) {
            return new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static HttpRequestMessage CreateRequest(string baseUrl, string url, string userId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx") {
            return new HttpRequestMessage {
                Method = HttpMethod.Get,
                RequestUri = new Uri(baseUrl + url),
                Content = new StringContent(JsonConvert.SerializeObject(new User { UserId = userId }), Encoding.UTF8, MediaTypeNames.Application.Json)
            };
        }

        public static StringContent ConvertObjectToJson(Object record) {
            return new StringContent(JsonConvert.SerializeObject(record), Encoding.UTF8, MediaTypeNames.Application.Json);
        }

    }

}