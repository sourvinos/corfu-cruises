using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using BlueWaterCruises;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests {

    public class Customers02GetActive : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture appsettingsFixture;
        private readonly HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string baseUrl { get; set; }
        private string url { get; set; } = "/customers/getActiveForDropdown";
        private string nonExistentUserId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

        #endregion

        public Customers02GetActive(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // act
            var actionResponse = await httpClient.GetAsync(this.baseUrl + this.url);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _02_Unauthorized_When_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = Helpers.CreateRequest(this.baseUrl, this.url, this.nonExistentUserId);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(UserCanListActiveRecords))]
        public async Task _03_User_Can_List_Active_Records(Login login) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(login.Username, login.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = Helpers.CreateRequest(this.baseUrl, this.url, loginResponse.userId);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<List<SimpleResource>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            // assert
            Assert.Equal(11, records.Count());
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = login.UserId });
        }

    }

}