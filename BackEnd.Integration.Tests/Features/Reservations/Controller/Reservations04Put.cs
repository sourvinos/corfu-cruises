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
        private string dummyUrl { get; set; } = "/reservations/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
        private string dummyReservationId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
        private string dummyUserId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

        #endregion

        public Reservations04Put(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // arrange
            var record = this.CreateRecord(this.dummyReservationId, this.dummyUserId);
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + this.dummyUrl, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task _02_Unauthorized_When_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(this.dummyReservationId, loginResponse.userId);
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + this.dummyUrl, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(SimpleUserCanNotUpdateNotOwnedRecord))]
        public async Task _03_Simple_User_Can_Not_Update_Not_Owned_Record(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(reservation.ReservationId, reservation.UserId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + "/reservations/" + reservation.ReservationId, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedResponseCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        [Theory]
        [ClassData(typeof(SimpleUserCanUpdateOwnRecord))]
        public async Task _04_Simple_User_Can_Update_Own_Record(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(reservation.ReservationId, loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + "/reservations/" + reservation.ReservationId, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedResponseCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        [Theory]
        [ClassData(typeof(AdminCanUpdateRecordOwnedByAnyone))]
        public async Task _05_Admin_Can_Update_Record_Owned_By_Anyone(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(reservation.ReservationId, loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + "/reservations/" + reservation.ReservationId, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedResponseCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        private ReservationWriteResource CreateRecord(string reservationId, string userId, string date = "2021-10-01", int destinationId = 1, int portId = 1, int customerId = 1, int adults = 1, int kids = 0, int free = 0, string ticketNo = "xxxxxx") {
            return new ReservationWriteResource {
                ReservationId = Guid.Parse(reservationId),
                Date = date,
                Adults = adults,
                Kids = 2,
                Free = 1,
                TicketNo = ticketNo,
                Email = "email@server.com",
                Phones = "9641 414 533",
                CustomerId = customerId,
                DestinationId = 1,
                DriverId = 19,
                PickupPointId = 124,
                PortId = portId,
                ShipId = 1,
                Remarks = "TESTING RESERVATION",
                UserId = userId
            };
        }

    }

}