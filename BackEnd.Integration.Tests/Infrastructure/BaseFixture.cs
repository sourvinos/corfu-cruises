using Xunit;

namespace BackEnd.IntegrationTests {

    public class BaseFixture : IClassFixture<AppSettingsFixture> {

        public AppSettingsFixture appSettingsFixture { get; set; }
        public string baseUrl { get; set; }

        public BaseFixture(AppSettingsFixture appSettings) {
            this.appSettingsFixture = appSettings;
            this.baseUrl = appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
        }

    }

}
