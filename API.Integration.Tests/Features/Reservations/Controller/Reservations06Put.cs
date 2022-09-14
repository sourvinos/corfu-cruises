using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Reservations {

    [Collection("Sequence")]
    public class Reservations06Put : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;
        private readonly string _actionVerb = "put";
        private readonly string _url = "/reservations";

        #endregion

        public Reservations06Put(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(ActiveAdminsCanUpdateWhenValid))]
        public async Task Unauthorized_Not_Logged_In(TestUpdateReservation record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url + "/" + record.ReservationId.ToString(), _actionVerb, "", "", record);
        }

        [Theory]
        [ClassData(typeof(ActiveAdminsCanUpdateWhenValid))]
        public async Task Unauthorized_Invalid_Credentials(TestUpdateReservation record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url + "/" + record.ReservationId.ToString(), _actionVerb, "user-does-not-exist", "not-a-valid-password", record);
        }

        [Theory]
        [ClassData(typeof(ActiveSimpleUsersCanNotUpdate))]
        public async Task Active_Simple_Users_Can_Not_Update(TestUpdateReservation record) {
            var actionResponse = await RecordInvalidNotSaved.Action(_httpClient, _baseUrl, _url + "/" + record.ReservationId.ToString(), _actionVerb, "simpleuser", "1234567890", record);
            Assert.Equal((HttpStatusCode)record.StatusCode, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(ActiveAdminsCanUpdateWhenValid))]
        public async Task Active_Admins_Can_Update_When_Valid(TestUpdateReservation record) {
            await RecordSaved.Action(_httpClient, _baseUrl, _url + "/" + record.ReservationId.ToString(), _actionVerb, "john", "ec11fc8c16da", record);
        }

        [Theory]
        [ClassData(typeof(ActiveAdminsCanNotUpdateWhenInvalid))]
        public async Task Active_Admins_Can_Not_Update_When_Invalid(TestUpdateReservation record) {
            var actionResponse = await RecordInvalidNotSaved.Action(_httpClient, _baseUrl, _url + "/" + record.ReservationId.ToString(), _actionVerb, "john", "ec11fc8c16da", record);
            Assert.Equal((HttpStatusCode)record.StatusCode, actionResponse.StatusCode);
        }

    }

}