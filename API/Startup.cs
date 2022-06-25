using System;
using System.Net;
using API.Infrastructure.Auth;
using API.Infrastructure.Classes;
using API.Infrastructure.Email;
using API.Infrastructure.Exceptions;
using API.Infrastructure.Extensions;
using API.Infrastructure.Identity;
using API.Infrastructure.Notifications;
using API.Infrastructure.SeedData;
using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

// dotnet watch run --environment LocalDevelopment | LocalTesting | ProductionLive | ProductionDemo
// dotnet publish /p:Configuration=Release /p:EnvironmentName=ProductionDemo | ProductionLive

namespace API {

    public class Startup {

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment environment) {
            Configuration = configuration;
            Environment = environment;
        }

        public void ConfigureLocalDevelopmentServices(IServiceCollection services) {
            services.AddDbContextFactory<AppDbContext>(options => options.UseMySql(Configuration.GetConnectionString("LocalDevelopment"), new MySqlServerVersion(new Version(8, 0, 19)), builder => {
                builder.EnableStringComparisonTranslations();
                builder.EnableRetryOnFailure(maxRetryCount: 10, maxRetryDelay: TimeSpan.FromSeconds(10), errorNumbersToAdd: null);
            }));
            ConfigureServices(services);
        }

        public void ConfigureLocalTestingServices(IServiceCollection services) {
            services.AddDbContextFactory<AppDbContext>(options => {
                options.UseMySql(Configuration.GetConnectionString("LocalTesting"), new MySqlServerVersion(new Version(8, 0, 19)), builder => builder.EnableStringComparisonTranslations());
                options.EnableSensitiveDataLogging();
            });
            ConfigureServices(services);
        }

        public void ConfigureProductionLiveServices(IServiceCollection services) {
            services.AddDbContextFactory<AppDbContext>(options => options.UseMySql(Configuration.GetConnectionString("ProductionLive"), new MySqlServerVersion(new Version(8, 0, 19)), builder => {
                builder.EnableStringComparisonTranslations();
            }));
            ConfigureServices(services);
        }

        public void ConfigureProductionDemoServices(IServiceCollection services) {
            services.AddDbContextFactory<AppDbContext>(options => options.UseMySql(Configuration.GetConnectionString("ProductionDemo"), new MySqlServerVersion(new Version(8, 0, 19)), builder => {
                builder.EnableStringComparisonTranslations();
                builder.EnableRetryOnFailure(maxRetryCount: 10, maxRetryDelay: TimeSpan.FromSeconds(10), errorNumbersToAdd: null);
            }));
            ConfigureServices(services);
        }

        public void ConfigureServices(IServiceCollection services) {
            Cors.AddCors(services);
            Identity.AddIdentity(services);
            Authentication.AddAuthentication(Configuration, services);
            Interfaces.AddInterfaces(services);
            ModelValidations.AddModelValidation(services);
            services.AddSignalR();
            services.AddTransient<ExceptionHandling>();
            services.Configure<RazorViewEngineOptions>(options => options.ViewLocationExpanders.Add(new ViewLocationExpander()));
            services.AddAntiforgery(options => { options.Cookie.Name = "_af"; options.Cookie.HttpOnly = true; options.Cookie.SecurePolicy = CookieSecurePolicy.Always; options.HeaderName = "X-XSRF-TOKEN"; });
            services.AddAutoMapper(typeof(Startup));
            services.AddDbContext<AppDbContext>();
            services.AddScoped<ModelValidationAttribute>();
            services.AddControllersWithViews()
                    .AddNewtonsoftJson(options => {
                        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                        options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                    })
                    .AddFluentValidation(options => options.RegisterValidatorsFromAssemblyContaining<Startup>());
            services.AddEmailSenders();
            services.Configure<CookiePolicyOptions>(options => { options.CheckConsentNeeded = _ => true; options.MinimumSameSitePolicy = SameSiteMode.None; });
            services.Configure<EmailSettings>(options => Configuration.GetSection("EmailSettings").Bind(options));
            services.Configure<TokenSettings>(options => Configuration.GetSection("TokenSettings").Bind(options));
            services.Configure<TestingEnvironment>(options => Configuration.GetSection("TestingEnvironment").Bind(options));
            services.Configure<DirectoryLocations>(options => Configuration.GetSection("DirectoryLocations").Bind(options));
        }

        public void ConfigureLocalDevelopment(IApplicationBuilder app) {
            app.UseDeveloperExceptionPage();
            Configure(app);
            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
                endpoints.MapHub<ConnectedUserHub>("/auth");
            });
        }

        public void ConfigureLocalTesting(IApplicationBuilder app, RoleManager<IdentityRole> roleManager, UserManager<UserExtended> userManager, AppDbContext context) {
            app.UseDeveloperExceptionPage();
            Configure(app);
            app.UseEndpoints(endpoints => endpoints.MapControllers());
            SeedDatabaseMaster.SeedDatabase(roleManager, userManager, context);
        }

        public void ConfigureProductionLive(IApplicationBuilder app) {
            app.UseHsts();
            Configure(app);
            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
                endpoints.MapHub<ConnectedUserHub>("/auth");
            });
        }

        public void ConfigureProductionDemo(IApplicationBuilder app) {
            app.UseHsts();
            Configure(app);
            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
                endpoints.MapHub<ConnectedUserHub>("/auth");
            });
        }

        public virtual void Configure(IApplicationBuilder app) {
            app.UseExceptionHandler(appBuilder => {
                appBuilder.Run(async context => {
                    var logger = appBuilder.ApplicationServices.GetRequiredService<ILogger<Startup>>();
                    var feature = context.Features.Get<IExceptionHandlerFeature>();
                    if (feature.Error != null) {
                        logger.LogError(feature.Error, "Exception!");
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new {
                            error = "Something went wrong!",
                            detail = feature.Error.Message
                        }));
                    }
                });
            });
            app.UseDefaultFiles();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseMiddleware<ExceptionHandling>();
            app.UseRouting();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
        }

    }

}
