using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CorfuCruises {

    public class Program {

        public static void Main(string[] args) {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) {
            return WebHost.CreateDefaultBuilder()
                .ConfigureLogging((context, logging) => {
                    logging.FileLogger(options => {
                        context.Configuration.GetSection("Logging").GetSection("File").GetSection("Options").Bind(options);
                    });
                })
                .UseStartup<Startup>()
                .Build();
        }

    }

}
