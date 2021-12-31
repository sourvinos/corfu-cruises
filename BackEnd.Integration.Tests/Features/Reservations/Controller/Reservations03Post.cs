using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests.Reservations {

    public class Reservations03Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;

        #endregion

        public Reservations03Post(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(ExistingReservation))]
        public async Task Unauthorized_Not_Logged_In(TestReservation record) {
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(ExistingReservation))]
        public async Task Unauthorized_Invalid_Credentials(TestReservation record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(NewAdminReservationWithErrors))]
        public async Task Admins_Can_Not_Create_When_Invalid(TestReservation record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal((HttpStatusCode)record.StatusCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Theory]
        [ClassData(typeof(NewSimpleUserReservationWithErrors))]
        public async Task Simple_Users_Can_Not_Create_When_Invalid(TestReservation record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal((HttpStatusCode)record.StatusCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Theory]
        [ClassData(typeof(NewReservationsWithoutErrors))]
        public async Task Admins_Can_Create_When_Valid(TestReservation record) {
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
