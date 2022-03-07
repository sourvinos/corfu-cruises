using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Cases;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Reservations {

    [Collection("Sequence")]
    public class Reservations06Delete : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "delete";
        private readonly string _baseUrl;
        private readonly string _notFoundUrl = "/reservations/xxxxxxxx-5310-4f58-be17-xxxxxxxxxxxx";
        private readonly string _url = "/reservations/";
        private readonly string _deleteUrl = "/reservations/0316855d-d5da-44a6-b09c-89a8d014a963";

        #endregion

        public Reservations06Delete(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _deleteUrl, _actionVerb, "", "", null);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _deleteUrl, _actionVerb, "user-does-not-exist", "not-a-valid-password", null);
        }

        [Theory]
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _deleteUrl, _actionVerb, login.Username, login.Password, null);
        }

        [Fact]
        public async Task Active_Admins_Not_Found_When_Not_Exists() {
            await RecordNotFound.Action(_httpClient, _baseUrl, _notFoundUrl, "john", "ec11fc8c16da");
        }

        [Fact]
        public async Task Active_Simple_Users_Can_Not_Delete() {
            await Forbidden.Action(_httpClient, _baseUrl, _deleteUrl, _actionVerb, "matoula", "820343d9e828", null);
        }

        [Theory]
        [ClassData(typeof(ActiveAdminsCanDeleteOwnedByAnyone))]
        public async Task Active_Admins_Can_Delete(TestReservation record) {
            await RecordDeleted.Action(_httpClient, _baseUrl, _url + record.ReservationId.ToString(), "john", "ec11fc8c16da");
        }

    }

}