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

    public class Reservations01Get {

        private readonly TestHostFixture testHostFixture = new TestHostFixture();
        private HttpClient httpClient;
        private string url { get; set; } = "https://localhost:5001/api/reservations/date/2021-10-01";

        public Reservations01Get() {
            httpClient = testHostFixture.Client;
        }

        [Fact]
        public async Task Reservations01Get_For_Date_Returns_401_When_Not_Logged_In() {
            // arrange
            var actionResponse = await httpClient.GetAsync(this.url);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task Reservations02Get_For_Date_Returns_401_When_Invalid_Credentials() {
            // arrange
            TokenResponse loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            // act
            var actionResponse = await httpClient.GetAsync(this.url);
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Fact]
        public async Task Reservations03Get_For_Date_And_Admins_Returns_Records_From_All_Users() {
            // arrange
            TokenResponse loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("john", "ec11fc8c16da"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.token);
            var request = new HttpRequestMessage {
                Method = HttpMethod.Get,
                RequestUri = new Uri(this.url),
                Content = new StringContent(JsonSerializer.Serialize(new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" }), Encoding.UTF8, MediaTypeNames.Application.Json)
            };
            // act
            var actionResponse = await httpClient.SendAsync(request);
            var records = JsonSerializer.Deserialize<ReservationGroupResource<ReservationListResource>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" });
        }

        [Fact]
        public async Task Reservations04Get_For_Date_And_Not_Admin_Returns_Records_Only_From_User() {
            // arrange
            TokenResponse loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials("matoula", "820343d9e828"));
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
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            Assert.Equal(43, records.Persons);
            // cleanup
            await Helpers.Logout(httpClient, new User { UserId = "7b8326ad-468f-4dbd-bf6d-820343d9e828" });
        }

    }

}