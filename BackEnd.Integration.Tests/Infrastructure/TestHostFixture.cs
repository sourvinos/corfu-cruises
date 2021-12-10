using System;
using System.Net.Http;
using BlueWaterCruises;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace BackEnd.IntegrationTests {

    public class TestHostFixture : IDisposable {

        public HttpClient Client ;
        public IServiceProvider ServiceProvider;
        public IConfiguration configuration;

        public TestHostFixture() {
            var builder = Program.CreateHostBuilder(null)
                .ConfigureWebHost(webHost => {
                    webHost.UseTestServer();
                    webHost.UseEnvironment("Testing");
                });
            var host = builder.Start();
            ServiceProvider = host.Services;
            Client = host.GetTestClient();
        }

        public void Dispose() {
            GC.SuppressFinalize(this);
        }

    }

}
