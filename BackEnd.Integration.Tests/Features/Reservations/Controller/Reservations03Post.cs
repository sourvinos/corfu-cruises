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
        private string dummyUserId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
        private string url { get; set; } = "/reservations";

        #endregion

        public Reservations03Post(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task _01_Unauthorized_When_Not_Logged_In() {
            // arrange
            var record = this.CreateRecord(this.dummyUserId);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + "/reservations", new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
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

        [Theory]
        [ClassData(typeof(NewReservationWithErrors))]
        public async Task _03_Can_Not_Create_Record_When_Invalid_Schedule(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + "/reservations", new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedResponseCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        [Theory]
        [ClassData(typeof(NewReservationsWithoutErrors))]
        public async Task _04_Can_Create_Record(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(loginResponse.userId, reservation.Date, reservation.DestinationId, reservation.PortId, reservation.CustomerId, reservation.Adults, reservation.Kids, reservation.Free, reservation.TicketNo);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + this.url, new StringContent(JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        private ReservationWriteResource CreateRecord(string userId, string date = "2021-10-01", int destinationId = 1, int portId = 1, int customerId = 1, int adults = 1, int kids = 0, int free = 0, string ticketNo = "xxxxxx") {
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
