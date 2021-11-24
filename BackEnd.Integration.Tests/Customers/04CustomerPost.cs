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
using Xunit;

namespace BackEnd.IntegrationTests {

    public class Customers04Post {

        private HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string url { get; set; } = "api/customers";

        public Customers04Post() {
            httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task Customers01Post_Unauthorized_When_Not_Logged_In() {
            // check
            CustomerWriteResource customer = this.CreateCustomer(null);
            var postResponse = await httpClient.PostAsync(this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            Assert.Equal(HttpStatusCode.Unauthorized, postResponse.StatusCode);
        }

        [Fact]
        public async Task Customers02Post_Unauthorized_When_Invalid_Credentials() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // post
            CustomerWriteResource customer = this.CreateCustomer(loginResponse.userId);
            var postResponse = await httpClient.PostAsync(this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            Assert.Equal(HttpStatusCode.Unauthorized, postResponse.StatusCode);
        }

        [Fact]
        public async Task Customers03Post_Forbidden_When_LoggedIn_User_Is_Not_Admin() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // post
            CustomerWriteResource customer = this.CreateCustomer(loginResponse.userId);
            var postResponse = await httpClient.PostAsync(this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            Assert.Equal(HttpStatusCode.Forbidden, postResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828" });
        }

        [Fact]
        public async Task Customers04Post_OK_When_LoggedIn_User_Is_Admin() {
            // login
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // post
            CustomerWriteResource customer = this.CreateCustomer(loginResponse.userId);
            var postResponse = await httpClient.PostAsync(this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            Assert.Equal(HttpStatusCode.OK, postResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

        private CustomerWriteResource CreateCustomer(string userId) {
            return new CustomerWriteResource {
                Description = Helpers.CreateRandomString(15),
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