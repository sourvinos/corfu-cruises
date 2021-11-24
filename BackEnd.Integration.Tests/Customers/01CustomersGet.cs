using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BlueWaterCruises;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests {

    public class Customers01Get {

        private HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string url { get; set; } = "api/customers";

        public Customers01Get() {
            httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task Customers01Get_Unauthorized_When_Not_Logged_In() {
            // check
            HttpResponseMessage actionResponse = await httpClient.GetAsync(this.url);
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }
        
        [Fact]
        public async Task Customers02Get_Unauthorized_When_Invalid_Credentials() {
            // login
            TokenResponse loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // check
            HttpResponseMessage actionResponse = await httpClient.GetAsync(this.url);
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task Customers03Get_Forbidden_When_LoggedIn_User_Is_Not_Admin() {
            // login
            TokenResponse loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // check
            HttpResponseMessage actionResponse = await httpClient.GetAsync(this.url);
            Assert.Equal(HttpStatusCode.Forbidden, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

        [Fact]
        public async Task Customers04Get_OK_When_LoggedIn_User_Is_Admin() {
            // login
            TokenResponse loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // check
            HttpResponseMessage actionResponse = await httpClient.GetAsync(this.url);
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

    }

}