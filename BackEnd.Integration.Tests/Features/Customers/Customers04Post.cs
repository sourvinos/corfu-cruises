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

    public class Customers04Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture appsettingsFixture;
        private readonly HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string baseUrl { get; set; }
        private string dummyUserId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
        private string url { get; set; } = "customers";

        #endregion

        public Customers04Post(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // arrange
            var record = this.CreateRecord(this.dummyUserId);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + "/customers", new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(CreateInvalidCredentials))]
        public async Task _02_Unauthorized_When_Invalid_Credentials(Login login) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(login.Username, login.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(loginResponse.userId);
            // act
            var postResponse = await httpClient.PostAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, postResponse.StatusCode);
        }

        [Fact]
        public async Task _03_Forbidden_When_User_Is_Not_An_Admin() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            var record = this.CreateRecord(loginResponse.userId);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Forbidden, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        [Fact]
        public async Task _04_Admins_Can_Create_A_Record() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            var record = this.CreateRecord(loginResponse.userId);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var postResponse = await httpClient.PostAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.OK, postResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        private CustomerWriteResource CreateRecord(string userId) {
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