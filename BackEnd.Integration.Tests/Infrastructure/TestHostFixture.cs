using System;
using System.Net.Http;
using BlueWaterCruises;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace BackEnd.IntegrationTests {

    public class TestHostFixture : IDisposable {

        public HttpClient Client { get; }
        public IServiceProvider ServiceProvider { get; }

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
            Client.Dispose();
        }

    }

    public class CustomWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup> where TStartup : class {

        public IConfiguration Configuration { get; }

    }

}
