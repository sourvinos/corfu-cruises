using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Cases;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Reservations {

    [Collection("Sequence")]
    public class Reservations02GetById : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "get";
        private readonly string _adminUrl = "/reservations/034464de-89bf-4828-b366-12671315dfba";
        private readonly string _baseUrl;
        private readonly string _notFoundUrl = "/reservations/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
        private readonly string _simpleUserUrl = "/reservations/202c08b1-f364-4224-bb7a-fc7765fbbf8d";

        #endregion

        public Reservations02GetById(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _adminUrl, _actionVerb, null, null, null);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _adminUrl, _actionVerb, "user-does-not-exist", "not-a-valid-password", null);
        }

        [Theory]
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _adminUrl, _actionVerb, login.Username, login.Password, null);
        }

        [Fact]
        public async Task Active_Users_Not_Found_When_Not_Exists() {
            await RecordNotFound.Action(_httpClient, _baseUrl, _notFoundUrl, "john", "ec11fc8c16da");
        }

        [Fact]
        public async Task Active_Simple_Users_Can_Not_Get_By_Id_Not_Owned() {
            await RecordNotOwned.Action(_httpClient, _baseUrl, _adminUrl, "matoula", "820343d9e828");
        }

        [Fact]
        public async Task Active_Simple_Users_Can_Get_By_Id_If_Owned() {
            await RecordFound.Action(_httpClient, _baseUrl, _simpleUserUrl, "matoula", "820343d9e828");
        }

        [Fact]
        public async Task Active_Admins_Can_Get_By_Id() {
            await RecordFound.Action(_httpClient, _baseUrl, _adminUrl, "john", "ec11fc8c16da");
        }

    }

}