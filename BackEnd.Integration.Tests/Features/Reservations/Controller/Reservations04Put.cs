using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BlueWaterCruises.Features.Reservations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests.Reservations {

    public class Reservations04Put : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;

        #endregion

        public Reservations04Put(AppSettingsFixture appsettings) {
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
            var actionResponse = await _httpClient.PutAsync(_baseUrl + reservation.FeatureUrl + reservation.ReservationId, Helpers.ConvertObjectToJson(record));
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
            var actionResponse = await _httpClient.PutAsync(_baseUrl + reservation.FeatureUrl + reservation.ReservationId, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(SimpleUserCanNotUpdateNotOwnedRecord))]
        public async Task Simple_Users_Can_Not_Update_Not_Owned_Records(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var record = CreateRecord(reservation);
            // act
            var actionResponse = await _httpClient.PutAsync(_baseUrl + reservation.FeatureUrl + reservation.ReservationId, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedResponseCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Theory]
        [ClassData(typeof(SimpleUserCanUpdateOwnRecord))]
        public async Task Simple_Users_Can_Update_Own_Records(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var record = CreateRecord(reservation);
            // act
            var actionResponse = await _httpClient.PutAsync(_baseUrl + reservation.FeatureUrl + reservation.ReservationId, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedResponseCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        [Theory]
        [ClassData(typeof(AdminCanUpdateRecordOwnedByAnyone))]
        public async Task Admins_Can_Update_Records_Owned_By_Anyone(Reservation reservation) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            var record = CreateRecord(reservation);
            // act
            var actionResponse = await _httpClient.PutAsync(_baseUrl + reservation.FeatureUrl + reservation.ReservationId, Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedResponseCode, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

        private static ReservationWriteResource CreateRecord(Reservation reservation) {
            return new ReservationWriteResource {
                ReservationId = Guid.Parse(reservation.ReservationId),
                Date = reservation.Date ?? "2021-10-01",
                Adults = reservation.Adults,
                Kids = 2,
                Free = 1,
                TicketNo = reservation.TicketNo ?? "xxxxx",
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