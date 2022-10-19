using Microsoft.Extensions.DependencyInjection;

namespace API.Infrastructure.Identity {

    public static class AddEmailExtensions {

        public static IServiceCollection AddEmailSenders(this IServiceCollection services) {

            services.AddTransient<IEmailSender, EmailSender>();

            return services;

        }

    }

}