using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using BlueWaterCruises.Features.Customers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests.Customers {

    public class Customers04Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;
        private readonly string _dummyUserId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
        private readonly string _url = "/customers";

        #endregion

        public Customers04Post(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            // arrange
            var record = CreateRecord(_dummyUserId);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + "/customers", new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var record = CreateRecord(loginResponse.UserId);
            // act
            var postResponse = await _httpClient.PostAsync(_baseUrl + _url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, postResponse.StatusCode);
        }

        [Fact]
        public async Task Simple_Users_Can_Not_Create_Records() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            var record = CreateRecord(loginResponse.UserId);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + _url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Forbidden, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Fact]
        public async Task Admins_Can_Create_Records() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            var record = CreateRecord(loginResponse.UserId);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var postResponse = await _httpClient.PostAsync(_baseUrl + _url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.OK, postResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        private static CustomerWriteResource CreateRecord(string userId) {
            return new CustomerWriteResource {
                Description = Helpers.CreateRandomString(15),
                Profession = Helpers.CreateRandomString(10),
                Address = Helpers.CreateRandomString(35),
                Phones = Helpers.CreateRandomString(12),
                PersonInCharge = Helpers.CreateRandomString(15),
                Email = Helpers.CreateRandomString(5) + "@" + Helpers.CreateRandomString(15) + ".com",
                IsActive = true,
                UserId = userId
            };
        }

    }

}