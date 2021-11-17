using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using BlueWaterCruises;
using BlueWaterCruises.Features.Customers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BackEnd.IntegrationTests {

    [TestClass]
    public class Put_Customer {

        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private HttpClient httpClient;
        private string url { get; set; } = "api/customers/1";

        [TestInitialize]
        public void SetUp() {
            httpClient = testHostFixture.Client;
        }

        [TestMethod]
        public async Task Put_Customer_Returns_401_When_Not_Logged_In() {
            // put
            CustomerWriteResource customer = this.CreateCustomer(null);
            var putResponse = await httpClient.PutAsync(this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            Assert.AreEqual(HttpStatusCode.Unauthorized, putResponse.StatusCode);
        }

        [TestMethod]
        public async Task Put_Customer_Returns_401_When_Invalid_Credentials() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // put
            CustomerWriteResource customer = this.CreateCustomer(loginResponse.userId);
            var putResponse = await httpClient.PutAsync(this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            Assert.AreEqual(HttpStatusCode.Unauthorized, putResponse.StatusCode);
        }

        [TestMethod]
        public async Task Put_Customer_Returns_403_When_LoggedIn_User_Is_Not_Admin() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // put
            CustomerWriteResource customer = this.CreateCustomer(loginResponse.userId);
            var putResponse = await httpClient.PutAsync(this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            Assert.AreEqual(HttpStatusCode.Forbidden, putResponse.StatusCode);
        }

        [TestMethod]
        public async Task Put_Customer_Returns_200_When_LoggedIn_User_Is_Admin() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // put
            CustomerWriteResource customer = this.CreateCustomer(loginResponse.userId);
            var putResponse = await httpClient.PutAsync(this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            Assert.AreEqual(HttpStatusCode.OK, putResponse.StatusCode);
        }

        private CustomerWriteResource CreateCustomer(string userId) {
            return new CustomerWriteResource {
                Id = 1,
                Description = Helpers.CreateRandomString(15) + " " + DateConversions.DateTimeToISOString(DateTime.Now),
                Profession = Helpers.CreateRandomString(10),
                Address = Helpers.CreateRandomString(35),
                Phones = Helpers.CreateRandomString(12),
                PersonInCharge = Helpers.CreateRandomString(15),
                Email = Helpers.CreateRandomString(5) + "@" + Helpers.CreateRandomString(15) + ".com",
                IsActive = true,
                UserId = userId
            };
        }

    }

}