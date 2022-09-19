using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Embarkations {

    [Collection("Sequence")]
    public class Passengers02Patch : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "patch";
        private readonly string _baseUrl;
        private readonly string _url = "/embarkation/embarkSinglePassenger?id=903";
        private readonly string _notFoundUrl = "/embarkation/embarkSinglePassenger?id=999999";

        #endregion

        public Passengers02Patch(AppSettingsFixture appsettings) {
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
        [ClassData(typeof(FoundPassenger))]
        public async Task Active_Simple_Users_Can_Not_Update(TestPassenger record) {
            await Forbidden.Action(_httpClient, _baseUrl, _url, _actionVerb, "simpleuser", "1234567890", record);
        }

        [Fact]
        public async Task Active_Admins_Not_Found_When_Not_Exists() {
            await RecordNotFound.Action(_httpClient, _baseUrl, _notFoundUrl, "john", "ec11fc8c16da");
        }

        [Theory]
        [ClassData(typeof(FoundPassenger))]
        public async Task Active_Admins_Can_Update_When_Found(TestPassenger record) {
            await RecordSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
        }

    }

}