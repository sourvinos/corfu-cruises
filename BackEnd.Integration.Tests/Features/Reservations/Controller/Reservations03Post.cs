using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
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

        #endregion

        public Reservations03Post(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(DummyReservation))]
        public async Task _01_Unauthorized_Not_Logged_In(Reservation reservation) {
            // arrange
            var record = this.CreateRecord(reservation);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + reservation.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(DummyReservation))]
        public async Task _02_Unauthorized_Invalid_Credentials(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(reservation);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + reservation.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(NewReservationWithErrors))]
        public async Task _03_Can_Not_Create_When_Invalid_Schedule(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(reservation);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + reservation.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedResponseCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        [Theory]
        [ClassData(typeof(NewReservationsWithoutErrors))]
        public async Task _04_Users_Can_Create_Records(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var record = this.CreateRecord(reservation);
            // act
            var actionResponse = await httpClient.PostAsync(this.baseUrl + reservation.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = loginResponse.userId });
        }

        private ReservationWriteResource CreateRecord(Reservation reservation) {
            return new ReservationWriteResource {
                Date = reservation.Date != null ? reservation.Date : "2021-10-01",
                Adults = reservation.Adults,
                Kids = 2,
                Free = 1,
                TicketNo = reservation.TicketNo != null ? reservation.TicketNo : "xxxxx",
                Email = "email@server.com",
                Phones = "9641 414 533",
                CustomerId = reservation.CustomerId == 0 ? 1 : reservation.CustomerId,
                DestinationId = 1,
                DriverId = 19,
                PickupPointId = 124,
                PortId = reservation.PortId,
                ShipId = 1,
                Remarks = "TESTING RESERVATION",
                UserId = reservation.UserId
            };
        }

    }

}
