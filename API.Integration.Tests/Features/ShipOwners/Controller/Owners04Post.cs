using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.IntegrationTests.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace API.IntegrationTests.ShipOwners {

    [Collection("Sequence")]
    public class Owners04Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;

        #endregion

        public Owners04Post(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(CreateValidShipOwner))]
        public async Task Unauthorized_Not_Logged_In(TestOwner record) {
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FeatureUrl, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(CreateValidShipOwner))]
        public async Task Unauthorized_Invalid_Credentials(TestOwner record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FeatureUrl, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(CreateValidShipOwner))]
        public async Task Unauthorized_Inactive_Simple_Users(TestOwner record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("marios", "2b24a7368e19"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FeatureUrl, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(CreateValidShipOwner))]
        public async Task Unauthorized_Inactive_Admins(TestOwner record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("nikoleta", "8dd193508e05"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FeatureUrl, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(CreateValidShipOwner))]
        public async Task Simple_Users_Can_Not_Create(TestOwner record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FeatureUrl, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Forbidden, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Theory]
        [ClassData(typeof(CreateValidShipOwner))]
        public async Task Admins_Can_Create(TestOwner record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FeatureUrl, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

    }

}