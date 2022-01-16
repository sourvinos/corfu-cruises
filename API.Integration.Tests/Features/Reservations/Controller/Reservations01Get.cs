using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.IntegrationTests.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace API.IntegrationTests.Reservations {

    [Collection("Sequence")]
    public class Reservations01Get : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;
        private readonly string _url = "/reservations/date/2021-10-01";
        private readonly string _adminId = "e7e014fd-5608-4936-866e-ec11fc8c16da";
        private readonly string _simpleUserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828";

        #endregion

        public Reservations01Get(AppSettingsFixture appsettings) {
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

        [Fact]
        public async Task Simple_Users_Can_List_Only_Owned() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(_baseUrl, _url, _simpleUserId);
            // act
            var actionResponse = await _httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<ReservationGroupResource<ReservationListResource>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions {
                PropertyNameCaseInsensitive = true
            });
            // assert
            Assert.Equal(5, records.Reservations.Count());
            Assert.Equal(23, records.Persons);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Fact]
        public async Task Admins_Can_List() {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(_baseUrl, _url, _adminId);
            // act
            var actionResponse = await _httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<ReservationGroupResource<ReservationListResource>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            // assert
            Assert.Equal(27, records.Reservations.Count());
            Assert.Equal(12, records.PersonsPerCustomer.Count());
            Assert.Single(records.PersonsPerDestination);
            Assert.Equal(3, records.PersonsPerDriver.Count());
            Assert.Equal(2, records.PersonsPerPort.Count());
            Assert.Equal(7, records.PersonsPerRoute.Count());
            Assert.Equal(2, records.PersonsPerShip.Count());
            Assert.Equal(134, records.Persons);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

    }

}