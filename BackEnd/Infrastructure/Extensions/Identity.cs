using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace BlueWaterCruises {

    public static class Identity {

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
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();
        }

        public static string GetConnectedUserId(IHttpContextAccessor httpContextAccessor) {
            return httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        }

        public static Task<bool> IsUserAdmin(IHttpContextAccessor httpContextAccessor) {
            return Task.Run(() => httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Role).Value == "admin");
        }

    }

}

