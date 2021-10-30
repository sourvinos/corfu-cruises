using System;
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
using Microsoft.Extensions.Logging;

namespace BlueWaterCruises {

    public class Startup {

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public void ConfigureDevelopmentServices(IServiceCollection services) {
            services.AddDbContextFactory<AppDbContext>(options => options.UseMySql(Configuration.GetConnectionString("LocalConnection"), new MySqlServerVersion(new Version(8, 0, 19))));
            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services) {
            services.AddDbContextFactory<AppDbContext>(options => options.UseMySql(Configuration.GetConnectionString("RemoteConnection"), new MySqlServerVersion(new Version(8, 0, 19))));
            ConfigureServices(services);
        }

        public void ConfigureServices(IServiceCollection services) {
            // Extensions
            Cors.AddCors(services);
            Identity.AddIdentity(services);
            Authentication.AddAuthentication(Configuration, services);
            Interfaces.AddInterfaces(services);
            ModelValidations.AddModelValidation(services);
            // Base
            services.Configure<RazorViewEngineOptions>(option => option.ViewLocationExpanders.Add(new ViewLocationExpander()));
            services.AddAntiforgery(options => { options.Cookie.Name = "_af"; options.Cookie.HttpOnly = true; options.Cookie.SecurePolicy = CookieSecurePolicy.Always; options.HeaderName = "X-XSRF-TOKEN"; });
            services.AddAutoMapper(typeof(Startup));
            services.AddControllersWithViews().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore).AddFluentValidation();
            services.AddDbContext<AppDbContext>();
            services.AddEmailSenders();
            services.Configure<CookiePolicyOptions>(options => { options.CheckConsentNeeded = context => true; options.MinimumSameSitePolicy = SameSiteMode.None; });
            services.Configure<EmailSettings>(options => Configuration.GetSection("ShipCruises").Bind(options));
            services.Configure<TokenSettings>(options => Configuration.GetSection("TokenSettings").Bind(options));
        }

        public void ConfigureDevelopment(IApplicationBuilder app, IWebHostEnvironment env, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, AppDbContext context, ILogger<Startup> logger) {
            app.UseDeveloperExceptionPage();
            Configure(app, env, userManager, roleManager, context);
        }

        public void ConfigureProduction(IApplicationBuilder app, IWebHostEnvironment env, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, AppDbContext context, ILogger<Startup> logger) {
            app.UseHsts();
            Configure(app, env, userManager, roleManager, context);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, AppDbContext context) {
            app.UseDefaultFiles();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }

    }

}
