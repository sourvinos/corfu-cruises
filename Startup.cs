using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace CorfuCruises {

    public class Startup {

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services) {
            // Static
            Extensions.AddIdentity(services);
            Extensions.AddAuthentication(Configuration, services);
            Extensions.AddCors(services);
            Extensions.AddInterfaces(services);
            Extensions.AddValidation(services);
            // Base
            services.Configure<RazorViewEngineOptions>(option => option.ViewLocationExpanders.Add(new FeatureViewLocationExpander()));
            services.AddAntiforgery(options => { options.Cookie.Name = "_af"; options.Cookie.HttpOnly = true; options.Cookie.SecurePolicy = CookieSecurePolicy.Always; options.HeaderName = "X-XSRF-TOKEN"; });
            services.AddAutoMapper(typeof(Startup));
            services.AddDbContext<DbContext>(options => options.UseMySql(Configuration.GetConnectionString("LocalConnection"), new MySqlServerVersion(new Version(8, 0, 19))));
            services.AddControllersWithViews().AddFluentValidation();
            services.AddDbContext<DbContext>();
            services.AddEmailSenders();
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });
            services.Configure<CookiePolicyOptions>(options => { options.CheckConsentNeeded = context => true; options.MinimumSameSitePolicy = SameSiteMode.None; });
            services.Configure<AppCorfuCruisesSettings>(options => Configuration.GetSection("AppCorfuCruises").Bind(options));
            services.Configure<WebDefaultSettings>(options => Configuration.GetSection("WebDefaultSettings").Bind(options));
            services.Configure<TokenSettings>(options => Configuration.GetSection("TokenSettings").Bind(options));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            } else {
                app.UseSpaStaticFiles();
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseHttpsRedirection();
            app.UseStatusCodePages();
            app.UseHttpsRedirection();
            app.UseEndpoints(endpoints => {
                endpoints.MapControllerRoute(name: "default", pattern: "{controller}/{action=Index}/{id?}");
            });
            app.UseSpa(spa => {
                spa.Options.SourcePath = "ClientApp";
                if (env.IsDevelopment()) {
                    spa.Options.StartupTimeout = new TimeSpan(days: 0, hours: 0, minutes: 5, seconds: 0);
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }

    }

}
