using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using BlueWaterCruises;
using BlueWaterCruises.Features.Reservations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests {

    public class Reservations02GetById : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture appsettingsFixture;
        private readonly HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string baseUrl { get; set; }
        private string myAdminReservation { get; set; } = "reservations/689051b9-df9e-4c68-91f6-1d093c1bf46c"; // Belongs to user ...6da which is an admin
        private string mySimpleUserReservation { get; set; } = "reservations/c4db7af5-5310-4f58-be17-83997d99a037"; // Belongs to user ...828 which is not an admin
        private string recordNotExists { get; set; } = "reservations/eab4c9a0-05eb-4880-874a-eaf0a12fefe9";

        #endregion

        public Reservations02GetById(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // act
            var actionResponse = await httpClient.GetAsync(this.baseUrl + this.myAdminReservation);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _02_Unauthorized_When_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = Helpers.CreateRequest(this.baseUrl, "user-does-not-exist", this.recordNotExists);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _03_NotFound_When_Record_Does_Not_Exist() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = Helpers.CreateRequest(this.baseUrl, "7b8326ad-468f-4dbd-bf6d-820343d9e828", this.recordNotExists);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<ReservationReadResource>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions {
                PropertyNameCaseInsensitive = true
            });
            // assert
            Assert.Equal(HttpStatusCode.NotFound, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

        [Fact]
        public async Task _05_Simple_Users_Can_Not_Read_Records_From_Other_Users() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = Helpers.CreateRequest(this.baseUrl, "7b8326ad-468f-4dbd-bf6d-820343d9e828", this.myAdminReservation);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<ReservationReadResource>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions {
                PropertyNameCaseInsensitive = true
            });
            // assert
            Assert.Equal((HttpStatusCode)490, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828" });
        }

        [Fact]
        public async Task _06_Simple_Users_Can_Read_Their_Own_Records() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = Helpers.CreateRequest(this.baseUrl, "7b8326ad-468f-4dbd-bf6d-820343d9e828", this.mySimpleUserReservation);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<ReservationReadResource>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions {
                PropertyNameCaseInsensitive = true
            });
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828" });
        }

        [Fact]
        public async Task _04_Admins_Can_Read_Records_From_All_Users() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = Helpers.CreateRequest(this.baseUrl, "7b8326ad-468f-4dbd-bf6d-820343d9e828", this.mySimpleUserReservation);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<ReservationReadResource>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

    }

}