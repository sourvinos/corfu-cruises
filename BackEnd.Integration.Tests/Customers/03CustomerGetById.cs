using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BlueWaterCruises;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests {

    public class Customers03GetById {

        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private HttpClient httpClient;
        private string url { get; set; } = "api/customers/1";

        public Customers03GetById() {
            httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task Customers01GetById_Unauthorized_When_Not_Logged_In() {
            // get
            var actionResponse = await httpClient.GetAsync(this.url);
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task Customers02GetById_Unauthorized_When_Invalid_Credentials() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // get
            var actionResponse = await httpClient.GetAsync(this.url);
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task Customers03GetById_OK_For_LoggedIn_Users() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // get
            var actionResponse = await httpClient.GetAsync(this.url);
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828" });
        }

    }

}