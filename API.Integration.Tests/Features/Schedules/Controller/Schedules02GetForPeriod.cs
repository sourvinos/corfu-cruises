using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using API.Features.Schedules;
using API.Integration.Tests.Cases;
using API.Integration.Tests.Infrastructure;
using API.Integration.Tests.Responses;
using Xunit;

namespace API.Integration.Tests.Schedules {

    [Collection("Sequence")]
    public class Schedules02GetForPeriod : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "get";
        private readonly string _baseUrl;
        private readonly string _url = "/schedules/from/2022-03-01/to/2022-03-01";

        #endregion

        public Schedules02GetForPeriod(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, null, null, null);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", null);
        }

        [Theory]
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, login.Username, login.Password, null);
        }

        [Theory]
        [ClassData(typeof(ActiveUsersCanLogin))]
        public async Task Active_Users_Can_List(Login login) {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _url, login.Username, login.Password);
            var records = JsonSerializer.Deserialize<List<ScheduleReservationGroup>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Single(records);
            Assert.Equal("2022-03-01", records[0].Date);
            Assert.Single(records[0].Destinations);
            var destinations = records[0].Destinations.ToList();
            Assert.Single(destinations);
            Assert.Equal("PAXOS - ANTIPAXOS", destinations[0].Description);
            Assert.Equal(30, destinations[0].PassengerCount);
            Assert.Equal(155, destinations[0].AvailableSeats);
            var ports = destinations[0].Ports.ToList();
            Assert.Equal(2, ports.Count);
            Assert.Equal("CORFU PORT", ports[0].Description);
            Assert.Equal(185, ports[0].MaxPassengers);
            Assert.True(ports[0].IsPrimary);
            Assert.Equal(10, ports[0].PassengerCount);
            Assert.Equal(155, ports[0].AvailableSeats);
            Assert.Equal("LEFKIMMI PORT", ports[1].Description);
            Assert.Equal(0, ports[1].MaxPassengers);
            Assert.False(ports[1].IsPrimary);
            Assert.Equal(20, ports[1].PassengerCount);
            Assert.Equal(155, ports[1].AvailableSeats);
        }

    }

}
