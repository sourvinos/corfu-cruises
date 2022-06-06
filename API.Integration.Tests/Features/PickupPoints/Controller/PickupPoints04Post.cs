using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using API.IntegrationTests.PickupPoints;
using Xunit;

namespace API.Integration.Tests.PickupPoints {

    [Collection("Sequence")]
    public class PickupPoints04Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "post";
        private readonly string _baseUrl;
        private readonly string _url = "/pickupPoints";

        #endregion

        public PickupPoints04Post(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(CreateValidPickupPoint))]
        public async Task Unauthorized_Not_Logged_In(TestPickupPoint record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, null, null, record);
        }

        [Theory]
        [ClassData(typeof(CreateValidPickupPoint))]
        public async Task Unauthorized_Invalid_Credentials(TestPickupPoint record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidPickupPoint))]
        public async Task Unauthorized_Inactive_Simple_Users(TestPickupPoint record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "marios", "2b24a7368e19", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidPickupPoint))]
        public async Task Unauthorized_Inactive_Admins(TestPickupPoint record) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "nikoleta", "8dd193508e05", record);
        }

        [Theory]
        [ClassData(typeof(CreateValidPickupPoint))]
        public async Task Active_Simple_Users_Can_Not_Create(TestPickupPoint record) {
            await RecordInvalidNotSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "simpleuser", "1234567890", record);
        }

        [Theory]
        [ClassData(typeof(CreateInvalidPickupPoint))]
        public async Task Active_Admins_Can_Not_Create_When_Invalid(TestPickupPoint record) {
            var actionResponse = await RecordInvalidNotSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
            Assert.Equal((HttpStatusCode)record.StatusCode, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(CreateValidPickupPoint))]
        public async Task Active_Admins_Can_Create_When_Valid(TestPickupPoint record) {
            await RecordSaved.Action(_httpClient, _baseUrl, _url, _actionVerb, "john", "ec11fc8c16da", record);
        }

    }

}