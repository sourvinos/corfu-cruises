using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Integration.Tests.Cases;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Reservations {

    [Collection("Sequence")]
    public class Reservations01Get : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "get";
        private readonly string _baseUrl;
        private readonly string _url = "/reservations/date/2021-10-01";

        #endregion

        public Reservations01Get(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, null, null, null);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", null);
        }

        [Theory]
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, login.Username, login.Password, null);
        }

        [Fact]
        public async Task Active_Simple_Users_Can_List_Only_Owned() {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _url, "matoula", "820343d9e828");
            var records = JsonSerializer.Deserialize<ReservationGroupResource<ReservationListResource>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(5, records.Reservations.Count());
            Assert.Equal(23, records.Persons);
        }

        [Fact]
        public async Task Active_Admins_Can_List() {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _url, "john", "ec11fc8c16da");
            var records = JsonSerializer.Deserialize<ReservationGroupResource<ReservationListResource>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(27, records.Reservations.Count());
            Assert.Equal(12, records.PersonsPerCustomer.Count());
            Assert.Single(records.PersonsPerDestination);
            Assert.Equal(3, records.PersonsPerDriver.Count());
            Assert.Equal(2, records.PersonsPerPort.Count());
            Assert.Equal(7, records.PersonsPerRoute.Count());
            Assert.Equal(2, records.PersonsPerShip.Count());
            Assert.Equal(134, records.Persons);
        }

    }

}