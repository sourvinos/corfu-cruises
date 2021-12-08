using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BlueWaterCruises;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests {

    public class Customers06Delete : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture appsettingsFixture;
        private readonly HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string baseUrl { get; set; }
        private string urlInUse { get; set; } = "/customers/1";
        private string urlNotInUse { get; set; } = "/customers/11";

        #endregion

        public Customers06Delete(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // act
            var actionResponse = await httpClient.DeleteAsync(this.baseUrl + this.urlNotInUse);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _02_Unauthorized_When_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.DeleteAsync(this.baseUrl + this.urlNotInUse);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _03_Simple_User_Can_Not_Delete_Record() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.DeleteAsync(this.baseUrl + this.urlNotInUse);
            // assert
            Assert.Equal(HttpStatusCode.Forbidden, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        [Fact]
        public async Task _04_Admin_Can_Not_Delete_In_Use_Record() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.DeleteAsync(this.baseUrl + this.urlInUse);
            // assert
            Assert.Equal((HttpStatusCode)491, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        [Fact]
        public async Task _05_Admin_Can_Delete_Not_In_Use_Record() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.DeleteAsync(this.baseUrl + this.urlNotInUse);
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

    }

}