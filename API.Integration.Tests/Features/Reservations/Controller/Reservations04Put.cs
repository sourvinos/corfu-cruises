using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using API.IntegrationTests.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace API.IntegrationTests.Reservations {

    public class Reservations04Put : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;

        #endregion

        public Reservations04Put(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(InvalidCredentials))]
        public async Task Unauthorized_Not_Logged_In(TestReservation record) {
            // act
            var actionResponse = await _httpClient.PutAsync(_baseUrl + record.FeatureUrl + record.ReservationId, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(InvalidCredentials))]
        public async Task Unauthorized_Invalid_Credentials(TestReservation record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PutAsync(_baseUrl + record.FeatureUrl + record.ReservationId, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(SimpleUsersCanNotUpdateNotOwnedRecords))]
        public async Task Simple_Users_Can_Not_Update_Not_Owned(TestReservation record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PutAsync(_baseUrl + record.FeatureUrl + record.ReservationId, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.BadRequest, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Theory]
        [ClassData(typeof(SimpleUsersCanUpdateOwnRecords))]
        public async Task Simple_Users_Can_Update_Own(TestReservation record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PutAsync(_baseUrl + record.FeatureUrl + record.ReservationId, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Theory]
        [ClassData(typeof(AdminsCanUpdateRecordsOwnedByAnyone))]
        public async Task Admin_Can_Update_Record_Owned_By_Anyone(TestReservation record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            record.UserId = loginResponse.UserId;
            // act
            var actionResponse = await _httpClient.PutAsync(_baseUrl + record.FeatureUrl + record.ReservationId, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

    }

}