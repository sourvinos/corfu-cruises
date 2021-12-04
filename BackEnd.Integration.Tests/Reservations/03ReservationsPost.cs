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

        [Theory]
        [ClassData(typeof(InvalidCredentials))]
        public async Task _01_Unauthorized_When_Invalid_Credentials(ReservationTest reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var postResponse = await httpClient.PostAsync(this.baseUrl + "/reservations", new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, postResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(NewReservationsWithoutErrors))]
        public async Task _02_Users_Can_Create_Records(ReservationTest reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + "/reservations", new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = reservation.UserId });
        }

        [Theory]
        [ClassData(typeof(NewReservationsWithErrors))]
        public async Task _03_Users_Can_Not_Create_Records_When_Schedule_Criteria_Are_Invalid(ReservationTest reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + "/reservations", new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedError, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = reservation.UserId });
        }

        private ReservationWriteResource CreateRecord(string userId, string date, int destinationId, int portId, int customerId, int adults, int kids, int free, string ticketNo) {
            return new ReservationWriteResource {
                ReservationId = Guid.NewGuid(),
                Date = date,
                Adults = adults,
                Kids = kids,
                Free = free,
                TicketNo = ticketNo,
                Email = "email@server.com",
                Phones = "9641 414 533",
                CustomerId = customerId,
                DestinationId = destinationId,
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
