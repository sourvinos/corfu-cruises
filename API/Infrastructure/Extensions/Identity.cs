using System;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Identity;
using API.Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace API.Infrastructure.Extensions {

    public static class Identity {

        public static void AddIdentity(IServiceCollection services) {
            services
                .AddIdentity<UserExtended, IdentityRole>(options => {
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
            return httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value.ToString();
        }

        public static async Task<int> GetLinkedCustomerId(string userId, UserManager<UserExtended> userManager) {
            var user = await userManager.FindByIdAsync(userId);
            return (int)user.CustomerId;
        }

        public static Task<bool> IsUserAdmin(IHttpContextAccessor httpContextAccessor) {
            return Task.Run(() => httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Role).Value == "admin");
        }

    }

}