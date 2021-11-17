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
            var credentials = new TokenRequest {
                Username = username,
                Password = password,
                GrantType = grantType
            };
            return credentials;
        }

        public static async Task<TokenResponse> Login(HttpClient httpClient, TokenRequest credentials) {
            var loginResponse = await httpClient.PostAsync("api/auth/auth", new StringContent(JsonSerializer.Serialize(credentials), Encoding.UTF8, MediaTypeNames.Application.Json));
            var loginResponseContent = await loginResponse.Content.ReadAsStringAsync();
            var loginResult = JsonSerializer.Deserialize<TokenResponse>(loginResponseContent);
            return loginResult;
        }

        public static string CreateRandomString(int length) {
            return new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

    }

}