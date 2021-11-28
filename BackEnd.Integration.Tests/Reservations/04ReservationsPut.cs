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

    public class Reservations04Put : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture appsettingsFixture;
        private readonly HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string baseUrl { get; set; }
        private string recordCreatedByLoggedInAdmin { get; set; } = "reservations/4d9fb197-b3e2-4834-b150-153896418591";
        private string recordCreatedByAnotherAdmin { get; set; } = "reservations/313587b0-247b-4e66-bded-235ed7434403";
        private string recordCreatedByLoggedInSimpleUser { get; set; } = "reservations/1de37e96-2df2-49f9-a241-b274d59d7466";
        private string recordCreatedByAnotherSimpleUser { get; set; } = "reservations/84514d35-c7af-415a-ba1c-d5671c34f694";
        private string fakeRecord { get; set; } = "reservations/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

        #endregion

        public Reservations04Put(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // arrange
            var record = this.CreateRecord("no-user-id", "b00b42a5-e458-4954-b19d-efe9c63323b4");
            // act
            HttpResponseMessage actionResponse = await httpClient.PutAsync(this.baseUrl + this.fakeRecord, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _02_Unauthorized_When_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord("no-user-id", "b00b42a5-e458-4954-b19d-efe9c63323b4");
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + this.fakeRecord, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [InlineData("john", "ec11fc8c16da", "e7e014fd-5608-4936-866e-ec11fc8c16da", "4d9fb197-b3e2-4834-b150-153896418591")] // admins can update their own records
        [InlineData("john", "ec11fc8c16da", "e7e014fd-5608-4936-866e-ec11fc8c16da", "313587b0-247b-4e66-bded-235ed7434403")] // admins can update records from other admins
        [InlineData("john", "ec11fc8c16da", "e7e014fd-5608-4936-866e-ec11fc8c16da", "84514d35-c7af-415a-ba1c-d5671c34f694")] // admins can update records from simple users
        public async Task _03_Admins_Can_Update_Records_From_All_Users(string user, string password, string userId, string reservationId) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(user, password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(loginResponse.userId, reservationId);
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + "reservations/" + reservationId, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = userId });
        }

        private ReservationWriteResource CreateRecord(string userId, string resevationId) {
            return new ReservationWriteResource {
                ReservationId = Guid.Parse(resevationId),
                Date = "2021-10-01",
                Adults = 3,
                Kids = 2,
                Free = 1,
                TicketNo = "FRS01",
                Email = "email@server.com",
                Phones = "9641 414 533",
                CustomerId = 14,
                DestinationId = 1,
                DriverId = 19,
                PickupPointId = 124,
                PortId = 1,
                ShipId = 1,
                Remarks = "TESTING RESERVATION",
                UserId = userId
            };
        }

    }

}