using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BlueWaterCruises;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests {

    public class Customers06Delete {

        private HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string url { get; set; } = "api/customers";

        public Customers06Delete() {
            httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task Customers01Delete_Unauthorized_When_Not_Logged_In() {
            // check
            var deleteResponse = await httpClient.DeleteAsync(this.url + "/1");
            Assert.Equal(HttpStatusCode.Unauthorized, deleteResponse.StatusCode);
        }

        [Fact]
        public async Task Customers02Delete_Unauthorized_When_Invalid_Credentials() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // delete
            var deleteResponse = await httpClient.DeleteAsync(this.url + "/1");
            Assert.Equal(HttpStatusCode.Unauthorized, deleteResponse.StatusCode);
        }

        [Fact]
        public async Task Customers03Delete_Forbidden_When_LoggedIn_User_Is_Not_Admin() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // delete
            var deleteResponse = await httpClient.DeleteAsync(this.url + "/1");
            Assert.Equal(HttpStatusCode.Forbidden, deleteResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828" });
        }

        [Fact]
        public async Task Customers04Delete_Error_When_LoggedIn_User_Is_Admin_And_Record_Is_In_Use() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // delete
            var deleteResponse = await httpClient.DeleteAsync(this.url + "/1");
            Assert.Equal((HttpStatusCode)491, deleteResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

        [Fact]
        public async Task Customers05Delete_OK_When_LoggedIn_User_Is_Admin_And_Record_Is_Not_In_Use() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // delete
            var deleteResponse = await httpClient.DeleteAsync(this.url + "/11");
            Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

    }

}