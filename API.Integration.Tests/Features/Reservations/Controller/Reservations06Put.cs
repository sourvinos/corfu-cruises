using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Reservations {

    // Last successful run: 2022-05-23

    [Collection("Sequence")]
    public class Reservations06Put : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;
        private readonly string _actionVerb = "put";
        private readonly string _url = "/reservations/1";


        #endregion

        public Reservations06Put(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(AdminsCanUpdate))]
        public async Task Unauthorized_Not_Logged_In(TestReservation record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "", "", record);
        }

        [Theory]
        [ClassData(typeof(AdminsCanUpdate))]
        public async Task Unauthorized_Invalid_Credentials(TestReservation record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", record);
        }

        [Theory]
        [ClassData(typeof(ActiveSimpleUsersCanNotUpdate))]
        public async Task Active_Simple_Users_Can_Not_Update(TestReservation record) {
            await Forbidden.Action(_httpClient, _baseUrl, _url, _actionVerb, "matoula", "820343d9e828", record);
        }

        [Theory]
        [ClassData(typeof(AdminsCanUpdate))]
        public async Task Active_Admins_Can_Update_When_Valid(TestReservation record) {
            await RecordSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
        }

        [Theory]
        [ClassData(typeof(ActiveAdminsCanNotUpdateWhenInvalid))]
        // Last successful run: 2022-05-23
        public async Task Active_Admins_Can_Not_Update_When_Invalid(TestReservation record) {
            var actionResponse = await RecordInvalidNotSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
            Assert.Equal((HttpStatusCode)record.StatusCode, actionResponse.StatusCode);
        }

    }

}