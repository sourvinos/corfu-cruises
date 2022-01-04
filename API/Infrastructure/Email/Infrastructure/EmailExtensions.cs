using Microsoft.Extensions.DependencyInjection;

namespace API.Infrastructure.Email {

    public static class AddEmailExtensions {

        public static IServiceCollection AddEmailSenders(this IServiceCollection services) {

            services.AddTransient<IEmailSender, EmailSender>();

            return services;

        }

    }

}