using System;
using API.Infrastructure.Auth;
using API.Infrastructure.Classes;
using API.Infrastructure.Email;
using API.Infrastructure.Extensions;
using API.Infrastructure.Identity;
using API.Infrastructure.Middleware;
using API.Infrastructure.SeedData;
using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API {

    public class Startup {

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment environment) {
            Configuration = configuration;
            Environment = environment;
        }

        public void ConfigureDevelopmentServices(IServiceCollection services) {
            services.AddDbContextFactory<AppDbContext>(options => options.UseMySql(Configuration.GetConnectionString("LocalConnection"), new MySqlServerVersion(new Version(8, 0, 19)), builder => builder.EnableStringComparisonTranslations()));
            ConfigureServices(services);
        }

        public void ConfigureTestingServices(IServiceCollection services) {
            services.AddDbContextFactory<AppDbContext>(options => {
                options.UseMySql(Configuration.GetConnectionString("LocalTestingConnection"), new MySqlServerVersion(new Version(8, 0, 19)), builder => builder.EnableStringComparisonTranslations());
                options.EnableSensitiveDataLogging();
            });
            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services) {
            services.AddDbContextFactory<AppDbContext>(options => options.UseMySql(Configuration.GetConnectionString("RemoteConnection"), new MySqlServerVersion(new Version(8, 0, 19)), builder => builder.EnableStringComparisonTranslations()));
            ConfigureServices(services);
        }

        public void ConfigureServices(IServiceCollection services) {
            Cors.AddCors(services);
            Identity.AddIdentity(services);
            Authentication.AddAuthentication(Configuration, services);
            Interfaces.AddInterfaces(services);
            ModelValidations.AddModelValidation(services);
            services.Configure<RazorViewEngineOptions>(options => options.ViewLocationExpanders.Add(new ViewLocationExpander()));
            services.AddAntiforgery(options => { options.Cookie.Name = "_af"; options.Cookie.HttpOnly = true; options.Cookie.SecurePolicy = CookieSecurePolicy.Always; options.HeaderName = "X-XSRF-TOKEN"; });
            services.AddAutoMapper(typeof(Startup));
            services.AddDbContext<AppDbContext>();
            services.AddScoped<ModelValidationAttribute>();
            services.AddControllersWithViews()
                    .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
                    .AddFluentValidation(options => options.RegisterValidatorsFromAssemblyContaining<Startup>());
            services.AddEmailSenders();
            services.Configure<CookiePolicyOptions>(options => { options.CheckConsentNeeded = _ => true; options.MinimumSameSitePolicy = SameSiteMode.None; });
            services.Configure<EmailSettings>(options => Configuration.GetSection("ShipCruises").Bind(options));
            services.Configure<TokenSettings>(options => Configuration.GetSection("TokenSettings").Bind(options));
            services.Configure<TestingEnvironment>(options => Configuration.GetSection("TestingEnvironment").Bind(options));
        }

        public void ConfigureDevelopment(IApplicationBuilder app) {
            app.UseDeveloperExceptionPage();
            Configure(app);
            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }

        public void ConfigureTesting(IApplicationBuilder app, RoleManager<IdentityRole> roleManager, UserManager<UserExtended> userManager, AppDbContext context) {
            app.UseDeveloperExceptionPage();
            Configure(app);
            app.UseEndpoints(endpoints => endpoints.MapControllers());
            SeedDatabaseMaster.SeedDatabase(roleManager, userManager, context);
        }

        public void ConfigureProduction(IApplicationBuilder app) {
            app.UseHsts();
            Configure(app);
            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }

        public virtual void Configure(IApplicationBuilder app) {
            app.UseDefaultFiles();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseMiddleware<ErrorHandlerMiddleware>();
            app.UseRouting();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
        }

    }

}
