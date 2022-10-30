using Cases;
using Infrastructure;
using Responses;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace Users {

    [Collection("Sequence")]
    public class Users05Delete : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "delete";
        private readonly string _baseUrl;
        private readonly string _inUseUrl = "/users/eae03de1-6742-4015-9d52-102dba5d7365";
        private readonly string _notFoundUrl = "/users/999";
        private readonly string _url = "/users/963c738d-4341-47bd-92db-0804617aee7d";

        #endregion

        public Users05Delete(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "", "", null);
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
        public async Task Simple_Users_Can_Not_Delete() {
            await Forbidden.Action(_httpClient, _baseUrl, _url, _actionVerb, "simpleuser", "1234567890", null);
        }

        [Fact]
        public async Task Admins_Not_Found_When_Not_Exists() {
            await RecordNotFound.Action(_httpClient, _baseUrl, _notFoundUrl, "john", "ec11fc8c16da");
        }

        [Fact]
        public async Task Admins_Can_Not_Delete_In_Use() {
            await RecordInUse.Action(_httpClient, _baseUrl, _inUseUrl, "john", "ec11fc8c16da");
        }

        [Fact]
        public async Task Admins_Can_Delete_Not_In_Use() {
            await RecordDeleted.Action(_httpClient, _baseUrl, _url, "john", "ec11fc8c16da");
        }

    }

}