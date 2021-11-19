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
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BackEnd.IntegrationTests {

    [TestClass]
    public class Get_Reservations {

        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private HttpClient httpClient;
        private ReservationRepository repository;
        private string url { get; set; } = "https://localhost:5001/api/reservations/date/2021-10-01";

        [TestInitialize]
        public void SetUp() {
            httpClient = testHostFixture.Client;
        }

        [TestMethod]
        public async Task Get_Reservations_For_Date_Returns_401_When_Not_Logged_In() {
            // arrange
            var actionResponse = await httpClient.GetAsync(this.url);
            // assert
            Assert.AreEqual(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [TestMethod]
        public async Task Get_Reservations_For_Date_Returns_401_When_Invalid_Credentials() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.GetAsync(this.url);
            // assert
            Assert.AreEqual(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [TestMethod]
        public async Task Get_Reservations_For_Date_And_Admins_Returns_Records_From_All_Users() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = new HttpRequestMessage {
                Method = HttpMethod.Get,
                RequestUri = new Uri(this.url),
                Content = new StringContent(JsonSerializer.Serialize(new User { UserId = "4fcd7909-0569-45d9-8b78-2b24a7368e19" }), Encoding.UTF8, MediaTypeNames.Application.Json)
            };
            // act
            var actionResponse = await httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<ReservationGroupResource<ReservationListResource>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            // assert
            Assert.AreEqual(HttpStatusCode.OK, actionResponse.StatusCode);
            Assert.AreEqual(records.Persons, 40);
        }

        [TestMethod]
        public async Task Get_Reservations_For_Date_And_Not_Admin_Returns_Records_Only_From_User() {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = new HttpRequestMessage {
                Method = HttpMethod.Get,
                RequestUri = new Uri(this.url),
                Content = new StringContent(JsonSerializer.Serialize(new User { UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828" }), Encoding.UTF8, MediaTypeNames.Application.Json)
            };
            // act
            var actionResponse = await httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<ReservationGroupResource<ReservationListResource>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            // assert
            Assert.AreEqual(HttpStatusCode.OK, actionResponse.StatusCode);
            Assert.AreEqual(records.Persons, 29);
        }

    }

}