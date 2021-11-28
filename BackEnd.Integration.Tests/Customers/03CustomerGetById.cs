using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BlueWaterCruises;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests {

    public class Customers03GetById : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture appsettingsFixture;
        private readonly HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string baseUrl { get; set; }
        private string urlNotExists { get; set; } = "customers/999";
        private string url { get; set; } = "customers/1";

        #endregion

        public Customers03GetById(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // act
            HttpResponseMessage actionResponse = await httpClient.GetAsync(this.baseUrl + this.url);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _02_Unauthorized_When_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = Helpers.CreateRequest(this.baseUrl, "user-does-not-exist", this.url);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _03_NotFound_When_Record_Does_Not_Exist() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.GetAsync(this.baseUrl + this.urlNotExists);
            // assert
            Assert.Equal(HttpStatusCode.NotFound, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

        [Theory]
        [InlineData("matoula", "820343d9e828", "7b8326ad-468f-4dbd-bf6d-820343d9e828")]
        [InlineData("john", "ec11fc8c16da", "e7e014fd-5608-4936-866e-ec11fc8c16da")]
        public async Task _03_Logged_In_Users_Can_Get_A_Record(string user, string password, string userId) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(user, password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = Helpers.CreateRequest(this.baseUrl, userId, this.url);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = userId });
        }

    }

}