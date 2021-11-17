using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BackEnd.IntegrationTests {

    [TestClass]
    public class Get_Customer_ById {

        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private HttpClient httpClient;
        private string url { get; set; } = "api/customers/1";

        [TestInitialize]
        public void SetUp() {
            httpClient = testHostFixture.Client;
        }

        [TestMethod]
        public async Task Get_Customer_ById_Returns_401_When_Not_Logged_In() {
            // get
            var actionResponse = await httpClient.GetAsync(this.url);
            Assert.AreEqual(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [TestMethod]
        public async Task Get_Customer_ById_Returns_401_When_Invalid_Credentials() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // get
            var actionResponse = await httpClient.GetAsync(this.url);
            Assert.AreEqual(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [TestMethod]
        public async Task Get_Customer_ById_Returns_200_For_LoggedIn_Users() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // get
            var actionResponse = await httpClient.GetAsync(this.url);
            Assert.AreEqual(HttpStatusCode.OK, actionResponse.StatusCode);
        }

    }

}