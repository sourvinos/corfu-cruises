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
        private string urlInUse { get; set; } = "customers/1";
        private string urlNotInUse { get; set; } = "customers/11";

        #endregion

        public Customers06Delete(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // act
            HttpResponseMessage deleteResponse = await httpClient.DeleteAsync(this.baseUrl + this.urlNotInUse);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, deleteResponse.StatusCode);
        }

        [Fact]
        public async Task _02_Unauthorized_When_Invalid_Credentials() {
            // arrange
            TokenResponse loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            HttpResponseMessage deleteResponse = await httpClient.DeleteAsync(this.baseUrl + this.urlNotInUse);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, deleteResponse.StatusCode);
        }

        [Fact]
        public async Task _03_Forbidden_When_User_Is_Not_An_Admin() {
            // arrange
            TokenResponse loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            HttpResponseMessage deleteResponse = await httpClient.DeleteAsync(this.baseUrl + this.urlNotInUse);
            // assert
            Assert.Equal(HttpStatusCode.Forbidden, deleteResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828" });
        }

        [Fact]
        public async Task _04_Admins_Can_Not_Delete_A_Record_When_In_Use() {
            // arrange
            TokenResponse loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            HttpResponseMessage deleteResponse = await httpClient.DeleteAsync(this.baseUrl + this.urlInUse);
            // assert
            Assert.Equal((HttpStatusCode)491, deleteResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

        [Fact]
        public async Task _05_Admins_Can_Delete_A_Record_When_Not_In_Use() {
            // arrange
            TokenResponse loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            HttpResponseMessage deleteResponse = await httpClient.DeleteAsync(this.baseUrl + this.urlNotInUse);
            // assert
            Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

    }

}