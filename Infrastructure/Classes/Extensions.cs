using FluentValidation;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System;

namespace CorfuCruises {

    public static class Extensions {

        public static void AddCors(IServiceCollection services) {
            services.AddCors(options =>
                options.AddPolicy("EnableCORS", builder => {
                    builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().AllowCredentials().Build();
                }));
        }

        public static void AddIdentity(IServiceCollection services) {
            services
                .AddIdentity<AppUser, IdentityRole>(options => {
                    options.Password.RequireDigit = false;
                    options.Password.RequiredLength = 1;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireLowercase = false;
                    options.User.RequireUniqueEmail = true;
                    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                    options.Lockout.MaxFailedAccessAttempts = 5;
                    options.Lockout.AllowedForNewUsers = true;
                })
                .AddEntityFrameworkStores<DbContext>()
                .AddDefaultTokenProviders();
        }

        public static void AddAuthentication(IConfiguration configuration, IServiceCollection services) {
            var tokenSettings = configuration.GetSection("TokenSettings");
            services.Configure<TokenSettings>(tokenSettings);
            var appSettings = tokenSettings.Get<TokenSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services
                .AddAuthentication(options => {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => {
                    options.TokenValidationParameters = new TokenValidationParameters {
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidIssuer = appSettings.Site,
                        ValidAudience = appSettings.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ClockSkew = TimeSpan.Zero
                    };
                }).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
                    configuration.Bind("CookieSettings", options));
        }

        public static void AddInterfaces(IServiceCollection services) {
            services.AddScoped<Token>();
            services.AddTransient<IBoardingRepository, BoardingRepository>();
            services.AddTransient<ICustomerRepository, CustomerRepository>();
            services.AddTransient<IDestinationRepository, DestinationRepository>();
            services.AddTransient<IDriverRepository, DriverRepository>();
            services.AddTransient<IGenderRepository, GenderRepository>();
            services.AddTransient<IGenderRepository, GenderRepository>();
            services.AddTransient<IInvoicingRepository, InvoicingRepository>();
            services.AddTransient<INationalityRepository, NationalityRepository>();
            services.AddTransient<IOccupantRepository, OccupantRepository>();
            services.AddTransient<IPickupPointRepository, PickupPointRepository>();
            services.AddTransient<IPortRepository, PortRepository>();
            services.AddTransient<IReservationRepository, ReservationRepository>();
            services.AddTransient<IWebRepository, WebRepository>();
            services.AddTransient<IRouteRepository, RouteRepository>();
            services.AddTransient<IScheduleRepository, ScheduleRepository>();
            services.AddTransient<IShipRepository, ShipRepository>();
        }

        public static void TryUpdateManyToMany<T, TKey>(this DbContext db, IEnumerable<T> currentItems, IEnumerable<T> newItems, Func<T, TKey> getKey) where T : class {
            db.Set<T>().RemoveRange(currentItems.Except(newItems, getKey));
            db.SaveChanges();
            db.Set<T>().AddRange(newItems.Except(currentItems, getKey));
            db.SaveChanges();
        }

        public static IEnumerable<T> Except<T, TKey>(this IEnumerable<T> items, IEnumerable<T> other, Func<T, TKey> getKeyFunc) {
            return items
                .GroupJoin(other, getKeyFunc, getKeyFunc, (item, tempItems) => new { item, tempItems })
                .SelectMany(t => t.tempItems.DefaultIfEmpty(), (t, temp) => new { t, temp })
                .Where(t => ReferenceEquals(null, t.temp) || t.temp.Equals(default(T)))
                .Select(t => t.t.item);
        }

        public static void AddValidation(IServiceCollection services) {
            services.AddTransient<IValidator<Customer>, CustomerValidator>();
            services.AddTransient<IValidator<Destination>, DestinationValidator>();
            services.AddTransient<IValidator<Driver>, DriverValidator>();
            services.AddTransient<IValidator<Gender>, GenderValidator>();
            services.AddTransient<IValidator<Nationality>, NationalityValidator>();
            services.AddTransient<IValidator<Occupant>, OccupantValidator>();
            services.AddTransient<IValidator<PickupPoint>, PickupPointValidator>();
            services.AddTransient<IValidator<Port>, PortValidator>();
            services.AddTransient<IValidator<Reservation>, ReservationValidator>();
            services.AddTransient<IValidator<Route>, RouteValidator>();
            services.AddTransient<IValidator<Schedule>, ScheduleValidator>();
        }

    }

}