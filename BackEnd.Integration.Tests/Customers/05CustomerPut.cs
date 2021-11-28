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

    public class Customers05Put : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture appsettingsFixture;
        private readonly HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string baseUrl { get; set; }
        private string url { get; set; } = "customers/1";

        #endregion

        public Customers05Put(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // act
            var putResponse = await httpClient.PutAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(this.CreateCustomer(null)), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, putResponse.StatusCode);
        }

        [Fact]
        public async Task _02_Unauthorized_When_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var customer = this.CreateCustomer(loginResponse.userId);
            // act
            var putResponse = await httpClient.PutAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, putResponse.StatusCode);
        }

        [Fact]
        public async Task _03_Forbidden_When_User_Is_Not_An_Admin() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            var customer = this.CreateCustomer(loginResponse.userId);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var putResponse = await httpClient.PutAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Forbidden, putResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828" });
        }

        [Fact]
        public async Task _04_Admins_Can_Update_A_Record() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            var customer = this.CreateCustomer(loginResponse.userId);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var putResponse = await httpClient.PutAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.OK, putResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

        private CustomerWriteResource CreateCustomer(string userId) {
            return new CustomerWriteResource {
                Id = 1,
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