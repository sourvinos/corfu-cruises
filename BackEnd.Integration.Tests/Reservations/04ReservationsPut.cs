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

        #endregion

        public Reservations04Put(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(InvalidCredentials))]
        public async Task _01_Unauthorized_When_Invalid_Credentials(ReservationWrite reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(reservation.ReservationId, loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + "/reservations/" + reservation.ReservationId, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(AdminsCanUpdateRecordsOwnedByAnyUser))]
        public async Task _02_Admins_Can_Update_Records_Owned_By_Any_User(ReservationWrite reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(reservation.ReservationId, loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + "/reservations/" + reservation.ReservationId, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedError, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = reservation.UserId });
        }

        [Theory]
        [ClassData(typeof(SimpleUsersCanUpdateTheirOwnRecords))]
        public async Task _03_Simple_Users_Can_Update_Their_Own_Records(ReservationWrite reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(reservation.ReservationId, loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + "/reservations/" + reservation.ReservationId, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedError, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = reservation.UserId });
        }

        [Theory]
        [ClassData(typeof(SimpleUsersCanNotUpdateRecordsOwnedByOtherUsers))]
        public async Task _04_Simple_Users_Can_Not_Update_Records_Owned_By_Other_Users(ReservationWrite reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(reservation.ReservationId, loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PutAsync(this.baseUrl + "/reservations/" + reservation.ReservationId, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedError, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = reservation.UserId });
        }

        private ReservationWriteResource CreateRecord(Guid reservationId, string userId, string date, int destinationId, int portId, int customerId, int adults, int kids, int free, string ticketNo) {
            return new ReservationWriteResource {
                ReservationId = reservationId,
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