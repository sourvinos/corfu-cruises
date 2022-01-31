using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Routes {

    [Collection("Sequence")]
    public class Routes04Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "post";
        private readonly string _baseUrl;
        private readonly string _url = "/routes";

        #endregion

        public Routes04Post(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(CreateValidRoute))]
        public async Task Unauthorized_Not_Logged_In(TestRoute record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, null, null, record);
        }

        [Theory]
        [ClassData(typeof(CreateValidRoute))]
        public async Task Unauthorized_Invalid_Credentials(TestRoute record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidRoute))]
        public async Task Unauthorized_Inactive_Simple_Users(TestRoute record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "marios", "2b24a7368e19", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidRoute))]
        public async Task Unauthorized_Inactive_Admins(TestRoute record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "nikoleta", "8dd193508e05", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidRoute))]
        public async Task Active_Simple_Users_Can_Not_Create(TestRoute record) {
            await RecordInvalidNotSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "matoula", "820343d9e828", record);
        }

        [Theory]
        [ClassData(typeof(CreateInvalidRoute))]
        public async Task Active_Admins_Can_Not_Create_When_Invalid(TestRoute record) {
            var actionResponse = await RecordInvalidNotSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
            Assert.Equal((HttpStatusCode)record.StatusCode, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(CreateValidRoute))]
        public async Task Active_Admins_Can_Create_When_Valid(TestRoute record) {
            await RecordSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
        }

    }

}