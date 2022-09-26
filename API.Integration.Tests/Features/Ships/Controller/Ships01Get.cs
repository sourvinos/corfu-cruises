using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using API.Features.Ships;
using API.Infrastructure.Classes;
using API.Integration.Tests.Cases;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Ships {

    [Collection("Sequence")]
    public class Ships01Get : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly int _expectedRecordCount = 4;
        private readonly string _actionVerb = "get";
        private readonly string _baseUrl;
        private readonly string _url = "/ships";

        #endregion

        public Ships01Get(AppSettingsFixture appsettings) {
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
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, login.Username, login.Password, null);
        }

        [Fact]
        public async Task Active_Simple_Users_Can_Not_List() {
            await Forbidden.Action(_httpClient, _baseUrl, _url, _actionVerb, "simpleuser", "1234567890", null);
        }

        [Fact]
        public async Task Active_Admins_Can_List() {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _url, "john", "ec11fc8c16da");
            var records = JsonSerializer.Deserialize<List<SimpleResource>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(_expectedRecordCount, records.Count);
        }

    }

}