using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace BackEnd.IntegrationTests.Vouchers {

    public class Vouchers01Create : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _baseUrl;

        #endregion

        public Vouchers01Create(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Theory]
        [ClassData(typeof(NewVoucher))]
        public async Task Unauthorized_Not_Logged_In(TestVoucher voucher) {
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + voucher.FullUrl(), Helpers.ConvertObjectToJson(voucher));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(NewVoucher))]
        public async Task Unauthorized_Invalid_Credentials(TestVoucher record) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials("user-does-not-exist", "not-a-valid-password"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + record.FullUrl(), Helpers.ConvertObjectToJson(record));
            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, actionResponse.StatusCode);
        }

        [Theory]
        [ClassData(typeof(NewVoucher))]
        public async Task Users_Can_Create(TestVoucher voucher) {
            // arrange
            var loginResponse = await Helpers.Login(_httpClient, Helpers.CreateLoginCredentials(voucher.Username, voucher.Password));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = await _httpClient.PostAsync(_baseUrl + voucher.FullUrl(), Helpers.ConvertObjectToJson(voucher));
            // assert
            Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);
            // cleanup
            await Helpers.Logout(_httpClient, loginResponse.UserId);
        }

    }

}
