using Microsoft.Extensions.DependencyInjection;

namespace BlueWaterCruises.Infrastructure.Email {

    public static class AddEmailExtensions {

        public static IServiceCollection AddEmailSenders(this IServiceCollection services) {

            services.AddTransient<IEmailSender, EmailSender>();

            return services;

        }

    }

}