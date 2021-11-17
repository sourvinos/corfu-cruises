using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BackEnd.IntegrationTests {

    [TestClass]
    public class Delete_Customer {

        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private HttpClient httpClient;
        private string url { get; set; } = "api/customers/1";

        [TestInitialize]
        public void SetUp() {
            httpClient = testHostFixture.Client;
        }

        [TestMethod]
        public async Task Delete_Customer_Returns_401_When_Not_Logged_In() {
            // delete
            var deleteResponse = await httpClient.DeleteAsync(this.url);
            Assert.AreEqual(HttpStatusCode.Unauthorized, deleteResponse.StatusCode);
        }

        [TestMethod]
        public async Task Delete_Customer_Returns_401_When_Invalid_Credentials() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // delete
            var deleteResponse = await httpClient.DeleteAsync(this.url);
            Assert.AreEqual(HttpStatusCode.Unauthorized, deleteResponse.StatusCode);
        }

        [TestMethod]
        public async Task Delete_Customer_Returns_403_When_LoggedIn_User_Is_Not_Admin() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // delete
            var deleteResponse = await httpClient.DeleteAsync(this.url);
            Assert.AreEqual(HttpStatusCode.Forbidden, deleteResponse.StatusCode);
        }

        [TestMethod]
        public async Task Delete_Customer_Returns_491_When_LoggedIn_User_Is_Admin_And_Record_Is_In_Use() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // delete
            var deleteResponse = await httpClient.DeleteAsync(this.url);
            Assert.AreEqual((HttpStatusCode)491, deleteResponse.StatusCode);
        }

        [TestMethod]
        public async Task Delete_Customer_Returns_200_When_LoggedIn_User_Is_Admin_And_Record_Is_Not_In_Use() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // delete
            var deleteResponse = await httpClient.DeleteAsync(this.url);
            Assert.AreEqual(HttpStatusCode.OK, deleteResponse.StatusCode);
        }

    }

}