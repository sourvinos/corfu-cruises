using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.IntegrationTests.Infrastructure;
using API.IntegrationTests.Routes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace API.IntegrationTests.Schedules {

    [Collection("Sequence")]
    public class Schedules04Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;

        #endregion

        public Schedules04Post(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(NewValidSchedule))]
        public async Task Unauthorized_Not_Logged_In(TestSchedule schedule) {
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + schedule.FeatureUrl, new StringContent(JsonSerializer.Serialize(schedule.TestScheduleBody), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(NewValidSchedule))]
        public async Task Unauthorized_Invalid_Credentials(TestSchedule schedule) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + schedule.FeatureUrl, new StringContent(JsonSerializer.Serialize(schedule.TestScheduleBody), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(NewValidSchedule))]
        public async Task Unauthorized_Inactive_Admins(TestSchedule schedule) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("nikoleta", "8dd193508e05"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + schedule.FeatureUrl, new StringContent(JsonSerializer.Serialize(schedule.TestScheduleBody), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(NewValidSchedule))]
        public async Task Simple_Users_Can_Not_Create(TestSchedule schedule) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + schedule.FeatureUrl, new StringContent(JsonSerializer.Serialize(schedule.TestScheduleBody), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Forbidden, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Theory]
        [ClassData(typeof(NewInvalidSchedule))]
        public async Task Admins_Can_Not_Create_When_Invalid(TestSchedule schedule) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + schedule.FeatureUrl, new StringContent(JsonSerializer.Serialize(schedule.TestScheduleBody), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal((HttpStatusCode)schedule.StatusCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Theory]
        [ClassData(typeof(NewValidSchedule))]
        public async Task Admins_Can_Create_When_Valid(TestSchedule schedule) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + schedule.FeatureUrl, new StringContent(JsonSerializer.Serialize(schedule.TestScheduleBody), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

    }

}