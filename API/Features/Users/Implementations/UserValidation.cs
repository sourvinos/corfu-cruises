using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Users {

    public class UserValidation : IUserValidation {

        private readonly AppDbContext context;
        private readonly IHttpContextAccessor httpContext;
        private readonly UserManager<UserExtended> userManager;

        public UserValidation(AppDbContext context, IHttpContextAccessor httpContext, UserManager<UserExtended> userManager) {
            this.context = context;
            this.httpContext = httpContext;
            this.userManager = userManager;
        }

        public int IsValid(IUser user) {
            return true switch {
                var x when x == !IsValidCustomer(user) => 450,
                var x when x == !IsUsernameUnique(user) => 498,
                var x when x == !IsEmailUnique(user) => 499,
                _ => 200,
            };
        }

        public bool IsUserOwner(string userId) {
            var connectedUserId = Identity.GetConnectedUserId(httpContext);
            var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, userId);
            return connectedUserDetails.Id == connectedUserId;
        }

        private bool IsValidCustomer(IUser user) {
            return context.Customers
                .AsNoTracking()
                .SingleOrDefault(x => x.Id == user.CustomerId && x.IsActive) != null;
        }

        private bool IsUsernameUnique(IUser user) {
            if (user.Id != null) {
                var x = userManager.FindByNameAsync(user.Username).Result;
                if (x == null || (x.Id == user.Id && x.UserName == user.Username)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }

        private bool IsEmailUnique(IUser user) {
            if (user.Id != null) {
                var x = userManager.FindByEmailAsync(user.Email).Result;
                if (x == null || (x.Id == user.Id && x.Email == user.Email)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }

    }

}
