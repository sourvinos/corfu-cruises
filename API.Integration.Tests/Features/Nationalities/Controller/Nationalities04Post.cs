using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Nationalities {

    [Collection("Sequence")]
    public class Nationalities04Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "post";
        private readonly string _baseUrl;
        private readonly string _url = "/nationalities";

        #endregion

        public Nationalities04Post(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(CreateValidNationality))]
        public async Task Unauthorized_Not_Logged_In(TestNationality record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "", "", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidNationality))]
        public async Task Unauthorized_Invalid_Credentials(TestNationality record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidNationality))]
        public async Task Unauthorized_Inactive_Simple_Users(TestNationality record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "marios", "2b24a7368e19", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidNationality))]
        public async Task Unauthorized_Inactive_Admins(TestNationality record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "nikoleta", "8dd193508e05", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidNationality))]
        public async Task Active_Simple_Users_Can_Not_Create(TestNationality record) {
            await Forbidden.Action(_httpClient, _baseUrl, _url, _actionVerb, "simpleuser", "1234567890", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidNationality))]
        public async Task Active_Admins_Can_Create_When_Valid(TestNationality record) {
            await RecordSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
        }

    }

}