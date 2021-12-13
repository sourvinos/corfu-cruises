using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Infrastructure.Classes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests.Reservations {

    public class Reservations03Post : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;

        #endregion

        public Reservations03Post(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(DummyReservation))]
        public async Task Unauthorized_Not_Logged_In(Reservation reservation) {
            // arrange
            var record = CreateRecord(reservation);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + reservation.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(DummyReservation))]
        public async Task Unauthorized_Invalid_Credentials(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var record = CreateRecord(reservation);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + reservation.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(NewReservationWithErrors))]
        public async Task Can_Not_Create_When_Invalid_Schedule(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var record = CreateRecord(reservation);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + reservation.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedResponseCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, new User { UserId = loginResponse.UserId });
        }

        [Theory]
        [ClassData(typeof(NewReservationsWithoutErrors))]
        public async Task Users_Can_Create_Records(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var record = CreateRecord(reservation);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + reservation.FeatureUrl, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, new User { UserId = loginResponse.UserId });
        }

        private static ReservationWriteResource CreateRecord(Reservation reservation) {
            return new ReservationWriteResource {
                Date = reservation.Date ?? "2021-10-01",
                Adults = reservation.Adults,
                Kids = reservation.Kids,
                Free = reservation.Free,
                TicketNo = reservation.TicketNo ?? "xxxxx",
                Email = "email@server.com",
                Phones = "9641 414 533",
                CustomerId = reservation.CustomerId == 0 ? 1 : reservation.CustomerId,
                DestinationId = reservation.DestinationId == 0 ? 1 : reservation.DestinationId,
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
