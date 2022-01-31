using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Ships {

    [Collection("Sequence")]
    public class Ships04Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "post";
        private readonly string _baseUrl;
        private readonly string _url = "/ships";

        #endregion

        public Ships04Post(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(CreateValidShip))]
        public async Task Unauthorized_Not_Logged_In(TestShip record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, null, null, record);
        }

        [Theory]
        [ClassData(typeof(CreateValidShip))]
        public async Task Unauthorized_Invalid_Credentials(TestShip record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidShip))]
        public async Task Unauthorized_Inactive_Simple_Users(TestShip record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "marios", "2b24a7368e19", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidShip))]
        public async Task Unauthorized_Inactive_Admins(TestShip record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "nikoleta", "8dd193508e05", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidShip))]
        public async Task Active_Simple_Users_Can_Not_Create(TestShip record) {
            await RecordInvalidNotSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "matoula", "820343d9e828", record);
        }

        [Theory]
        [ClassData(typeof(CreateInvalidShip))]
        public async Task Active_Admins_Can_Not_Create_When_Invalid(TestShip record) {
            var actionResponse = await RecordInvalidNotSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
            Assert.Equal((HttpStatusCode)record.StatusCode, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(CreateValidShip))]
        public async Task Active_Admins_Can_Create_When_Valid(TestShip record) {
            await RecordSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
        }

    }

}