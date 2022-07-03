using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Identity;
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

        public static Task<SimpleUser> GetConnectedUserId(IHttpContextAccessor httpContextAccessor) {
            return Task.Run(() => new SimpleUser { UserId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value });
        }

        public static UserExtended GetConnectedUserDetails(UserManager<UserExtended> userManager, string userId) {
            return userManager.Users.SingleOrDefault(x => x.Id == userId);
        }

        public static Task<bool> IsUserAdmin(IHttpContextAccessor httpContextAccessor) {
            return Task.Run(() => httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Role).Value == "admin");
        }

    }

}