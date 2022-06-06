using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using API.IntegrationTests.ShipRoutes;
using Xunit;

namespace API.Integration.Tests.ShipRoutes {

    [Collection("Sequence")]
    public class ShipRoutes05Put : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "put";
        private readonly string _baseUrl;
        private readonly string _url = "/shipRoutes/1";

        #endregion

        public ShipRoutes05Put(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(UpdateValidShipRoute))]
        public async Task Unauthorized_Not_Logged_In(TestShipRoute record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "", "", record);
        }

        [Theory]
        [ClassData(typeof(UpdateValidShipRoute))]
        public async Task Unauthorized_Invalid_Credentials(TestShipRoute record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", record);
        }

        [Theory]
        [ClassData(typeof(UpdateValidShipRoute))]
        public async Task Unauthorized_Inactive_Simple_Users(TestShipRoute record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "marios", "2b24a7368e19", record);
        }

        [Theory]
        [ClassData(typeof(UpdateValidShipRoute))]
        public async Task Unauthorized_Inactive_Admins(TestShipRoute record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "nikoleta", "8dd193508e05", record);
        }

        [Theory]
        [ClassData(typeof(UpdateValidShipRoute))]
        public async Task Active_Simple_Users_Can_Not_Update(TestShipRoute record) {
            await Forbidden.Action(_httpClient, _baseUrl, _url, _actionVerb, "simpleuser", "1234567890", record);
        }

        [Theory]
        [ClassData(typeof(UpdateValidShipRoute))]
        public async Task Active_Admins_Can_Update_When_Valid(TestShipRoute record) {
            await RecordSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
        }

    }

}