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
        private string dummyUrl { get; set; } = "/customers/999";
        private string url { get; set; } = "/customers/1";

        #endregion

        public Customers03GetById(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_Not_Logged_In() {
            // act
            var actionResponse = await httpClient.GetAsync(this.baseUrl + this.url);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _02_Unauthorized_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(this.baseUrl, this.url);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _03_Not_Found_When_Not_Exists() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(this.baseUrl, this.dummyUrl, loginResponse.UserId);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.NotFound, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.UserId });
        }

        [Theory]
        [ClassData(typeof(UserCanGetRecord))]
        public async Task _04_All_Users_Can_Get_By_Id(Login login) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(login.Username, login.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var request = Helpers.CreateRequest(this.baseUrl, this.url, loginResponse.UserId);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.UserId });
        }

    }

}