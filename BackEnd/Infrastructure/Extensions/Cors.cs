using Microsoft.Extensions.DependencyInjection;

namespace BlueWaterCruises {

    public static class Cors {

        public static void AddCors(IServiceCollection services) {
            services.AddCors(opt => {
                opt.AddDefaultPolicy(builder => {
                    builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                });
            });
        }

    }

}

