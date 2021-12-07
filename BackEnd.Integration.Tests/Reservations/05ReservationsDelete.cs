using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BlueWaterCruises;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests {

    public class Reservations05Delete : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture appsettingsFixture;
        private readonly HttpClient httpClient;
        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private string baseUrl { get; set; }

        #endregion

        public Reservations05Delete(AppSettingsFixture appsettings) {
            this.appsettingsFixture = appsettings;
            this.baseUrl = appsettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            this.httpClient = testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(InvalidCredentials))]
        public async Task _01_Unauthorized_When_Invalid_Credentials(ReservationDelete reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.DeleteAsync(this.baseUrl + "/reservations/" + reservation.ReservationId);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(AdminsCanDeleteRecordsOwnedByAnyUser))]
        public async Task _02_Admins_Can_Delete_Records_Owned_By_Any_User(ReservationDelete reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.DeleteAsync(this.baseUrl + "/reservations/" + reservation.ReservationId);
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedError, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = reservation.UserId });
        }

        [Theory]
        [ClassData(typeof(SimpleUsersCanNotDeleteRecords))]
        public async Task _03_Simple_Users_Can_Not_Delete_Records(ReservationDelete reservation) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(reservation.Username, reservation.Password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.DeleteAsync(this.baseUrl + "/reservations/" + reservation.ReservationId);
            // assert
            Assert.Equal((HttpStatusCode)reservation.ExpectedError, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = reservation.UserId });
        }

    }

}