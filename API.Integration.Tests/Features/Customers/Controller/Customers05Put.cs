using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Customers {

    [Collection("Sequence")]
    public class Customers05Put : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "put";
        private readonly string _baseUrl;
        private readonly string _url = "/customers";

        #endregion

        public Customers05Put(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(UpdateValidCustomer))]
        public async Task Unauthorized_Not_Logged_In(TestCustomer record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url + "/" + record.Id, _actionVerb, "", "", record);
        }

        [Theory]
        [ClassData(typeof(UpdateValidCustomer))]
        public async Task Unauthorized_Invalid_Credentials(TestCustomer record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url + "/" + record.Id, _actionVerb, "user-does-not-exist", "not-a-valid-password", record);
        }

        [Theory]
        [ClassData(typeof(UpdateValidCustomer))]
        public async Task Unauthorized_Inactive_Simple_Users(TestCustomer record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url + "/" + record.Id, _actionVerb, "marios", "2b24a7368e19", record);
        }

        [Theory]
        [ClassData(typeof(UpdateValidCustomer))]
        public async Task Unauthorized_Inactive_Admins(TestCustomer record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url + "/" + record.Id, _actionVerb, "nikoleta", "8dd193508e05", record);
        }

        [Theory]
        [ClassData(typeof(UpdateValidCustomer))]
        public async Task Active_Simple_Users_Can_Not_Update(TestCustomer record) {
            await Forbidden.Action(_httpClient, _baseUrl, _url + "/" + record.Id, _actionVerb, "simpleuser", "1234567890", record);
        }

        [Theory]
        [ClassData(typeof(UpdateValidCustomer))]
        public async Task Active_Admins_Can_Update_When_Valid(TestCustomer record) {
            await RecordSaved.Action(_httpClient, _baseUrl, _url + "/" + record.Id, _actionVerb, "john", "ec11fc8c16da", record);
        }

        [Theory]
        [ClassData(typeof(UpdateInvalidCustomer))]
        public async Task Active_Admins_Can_Not_Update_When_Invalid(TestCustomer record) {
            await RecordNotFound.Action(_httpClient, _baseUrl, _url + "/" + record.Id, "john", "ec11fc8c16da");
        }

    }

}