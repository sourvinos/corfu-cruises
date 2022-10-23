using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Users {

    public class UserValidation : IUserValidation<IUser> {

        private readonly IHttpContextAccessor httpContext;
        private readonly UserManager<UserExtended> userManager;
        private readonly AppDbContext context;

        public UserValidation(AppDbContext context, IHttpContextAccessor httpContext, UserManager<UserExtended> userManager) {
            this.context = context;
            this.httpContext = httpContext;
            this.userManager = userManager;
        }

        public bool IsUserOwner(string userId) {
            var connectedUserId = Identity.GetConnectedUserId(httpContext);
            var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, userId);
            return connectedUserDetails.Id == connectedUserId;
        }

        public int IsValid(IUser user) {
            return true switch {
                var x when x == !IsValidCustomer(user) => 450,
                _ => 200,
            };
        }

        private bool IsValidCustomer(IUser user) {
            return context.Customers
                .AsNoTracking()
                .SingleOrDefault(x => x.Id == user.CustomerId && x.IsActive) != null;
        }


    }

}
