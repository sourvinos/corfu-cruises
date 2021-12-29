using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Classes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests.Drivers {

    public class Drivers02GetActive : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;
        private readonly string _url = "/drivers/getActiveForDropdown";

        #endregion

        public Drivers02GetActive(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            // act
            var actionResponse = await _httpClient.GetAsync(_baseUrl + _url);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(_baseUrl, _url);
            // act
            var actionResponse = await _httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials(login.Username, login.Password));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(_baseUrl, _url);
            // act
            var actionResponse = await _httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(ActiveUsersCanLogin))]
        public async Task Users_Can_Get_Active_For_Dropdown(Login login) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials(login.Username, login.Password));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(_baseUrl, _url);
            // act
            var actionResponse = await _httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<List<SimpleResource>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            // assert
            Assert.Equal(12, records.Count);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

    }

}