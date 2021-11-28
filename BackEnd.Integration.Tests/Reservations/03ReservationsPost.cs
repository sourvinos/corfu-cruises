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

    public class Reservations03Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture appsettingsFixture;
        private readonly HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string baseUrl { get; set; }
        private string url { get; set; } = "reservations";

        #endregion

        public Reservations03Post(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // arrange
            var record = this.CreateRecord(null, "");
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _02_Unauthorized_When_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(loginResponse.userId);
            // act
            HttpResponseMessage postResponse = await httpClient.PostAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, postResponse.StatusCode);
        }

        [Theory]
        [InlineData("matoula", "820343d9e828", "7b8326ad-468f-4dbd-bf6d-820343d9e828")]
        [InlineData("john", "ec11fc8c16da", "e7e014fd-5608-4936-866e-ec11fc8c16da")]
        public async Task _03_Logged_In_Users_Can_Create_A_Record(string user, string password, string userId, string date) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(user, password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(loginResponse.userId);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = userId });
        }

        [Theory]
        [InlineData("john", "ec11fc8c16da", "e7e014fd-5608-4936-866e-ec11fc8c16da", 432, "2021-10-04", 1, 1, 3)] // we don't go anywhere on this day
        [InlineData("john", "ec11fc8c16da", "e7e014fd-5608-4936-866e-ec11fc8c16da", 430, "2021-10-02", 1, 1, 3)] // we don't go to Paxos on this day (we only go to Blue Lagoon)
        [InlineData("john", "ec11fc8c16da", "e7e014fd-5608-4936-866e-ec11fc8c16da", 427, "2021-10-02", 3, 2, 3)] // we don't go to Blue Lagoon from Lefkimmi on this day (we only go from Corfu)
        [InlineData("john", "ec11fc8c16da", "e7e014fd-5608-4936-866e-ec11fc8c16da", 433, "2021-10-01", 1, 1, 127)] // overbooking for primary port is not allowed
        [InlineData("john", "ec11fc8c16da", "e7e014fd-5608-4936-866e-ec11fc8c16da", 433, "2021-10-01", 1, 2, 288)] // overbooking for secondary port greater the the max persons is not allowed
        public async Task _03_Logged_In_Users_Can_Not_Create_A_Record_When_Inputs_Are_Invalid(string user, string password, string userId, int expectedError, string date, int destinationId, int portId, int adults) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(user, password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(loginResponse.userId, date, destinationId, portId, adults);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal((HttpStatusCode)expectedError, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = userId });
        }

        private ReservationWriteResource CreateRecord(string userId, string date = "2021-10-01", int destinationId = 1, int portId = 1, int adults = 3) {
            return new ReservationWriteResource {
                ReservationId = Guid.NewGuid(),
                Date = date,
                Adults = adults,
                Kids = 2,
                Free = 1,
                TicketNo = "FRS01",
                Email = "email@server.com",
                Phones = "9641 414 533",
                CustomerId = 14,
                DestinationId = destinationId,
                DriverId = 19,
                PickupPointId = 124,
                PortId = portId,
                ShipId = 1,
                Remarks = "TESTING RESERVATION",
                UserId = "4fcd7909-0569-45d9-8b78-2b24a7368e19"
            };
        }

    }

}