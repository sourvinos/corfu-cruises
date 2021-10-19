using System;
using System.IO;
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
using Microsoft.Extensions.Hosting;

namespace BlueWaterCruises {

    public class Startup {

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services) {
            // Static
            Identity.AddIdentity(services);
            Authentication.AddAuthentication(Configuration, services);
            services.AddCors(opt => {
                opt.AddDefaultPolicy(builder => {
                    builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                });
            });
            Interfaces.AddInterfaces(services);
            ModelValidations.AddModelValidation(services);
            // Base
            services.Configure<RazorViewEngineOptions>(option => option.ViewLocationExpanders.Add(new ViewLocationExpander()));
            services.AddAntiforgery(options => { options.Cookie.Name = "_af"; options.Cookie.HttpOnly = true; options.Cookie.SecurePolicy = CookieSecurePolicy.Always; options.HeaderName = "X-XSRF-TOKEN"; });
            services.AddAutoMapper(typeof(Startup));
            services.AddDbContextFactory<AppDbContext>(options => options.UseMySql(Configuration.GetConnectionString("LocalConnection"), new MySqlServerVersion(new Version(8, 0, 19))));
            // services.AddDbContext<AppDbContext>(options => options.UseSqlite(Configuration.GetConnectionString("SqliteConnection")));
            services.AddControllersWithViews()
                .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
                .AddFluentValidation();
            services.AddDbContext<AppDbContext>();
            services.AddEmailSenders();
            services.Configure<CookiePolicyOptions>(options => { options.CheckConsentNeeded = context => true; options.MinimumSameSitePolicy = SameSiteMode.None; });
            services.Configure<EmailSettings>(options => Configuration.GetSection("BlueWaterCruises").Bind(options));
            services.Configure<TokenSettings>(options => Configuration.GetSection("TokenSettings").Bind(options));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, AppDbContext context) {
            if (env.IsDevelopment()) {
                app.UseCors(options => options.WithOrigins("https://localhost:4200").AllowAnyMethod().AllowAnyHeader());
                app.UseDeveloperExceptionPage();
            } else {
                app.UseCors(options => options.WithOrigins("https://localhost:444").AllowAnyMethod().AllowAnyHeader());
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.Use(async (context, next) => {
                await next();
                if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value)) {
                    context.Request.Path = "/index.html";
                    await next();
                }
            });
            app.UseDefaultFiles();
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
            SeedDatabaseMaster.SeedDatabase(roleManager, userManager, context);
        }

    }

}
