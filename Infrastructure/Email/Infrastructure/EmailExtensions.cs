using Microsoft.Extensions.DependencyInjection;

namespace CorfuCruises {

    public static class AddEmailExtensions {

        public static IServiceCollection AddEmailSenders(this IServiceCollection services) {

            services.AddTransient<IEmailSender, SendGmailEmail>();

            return services;

        }

    }

}