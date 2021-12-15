using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests.Reservations {

    public class Reservations02GetById : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _adminUrl = "/reservations/034464de-89bf-4828-b366-12671315dfba";
        private readonly string _baseUrl;
        private readonly string _dummyUrl = "/reservations/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
        private readonly string _simpleUserUrl = "/reservations/202c08b1-f364-4224-bb7a-fc7765fbbf8d";

        #endregion

        public Reservations02GetById(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            // act
            var actionResponse = await _httpClient.GetAsync(_baseUrl + _dummyUrl);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(_baseUrl, _dummyUrl);
            // act
            var actionResponse = await _httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task Not_Found_When_Not_Exists() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(_baseUrl, _dummyUrl, loginResponse.UserId);
            // act
            var actionResponse = await _httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.NotFound, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Fact]
        public async Task Simple_Users_Can_Not_Read_Not_Owned_Records() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(_baseUrl, _adminUrl, loginResponse.UserId);
            // act
            var actionResponse = await _httpClient.SendAsync(request);
            // assert
            Assert.Equal((HttpStatusCode)490, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Fact]
        public async Task Simple_Users_Can_Read_Owned_Records() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(_baseUrl, _simpleUserUrl, loginResponse.UserId);
            // act
            var actionResponse = await _httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Fact]
        public async Task Admins_Can_Read_Records_Owned_By_Anyone() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(_baseUrl, _adminUrl, loginResponse.UserId);
            // act
            var actionResponse = await _httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

    }

}