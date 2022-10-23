using API.Infrastructure.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace API.Features.Users {

    public class UserValidation : IUserValidation {

        private readonly IHttpContextAccessor httpContext;
        private readonly UserManager<UserExtended> userManager;

        public UserValidation(IHttpContextAccessor httpContext, UserManager<UserExtended> userManager) {
            this.httpContext = httpContext;
            this.userManager = userManager;
        }

        public bool IsUserOwner(string userId) {
            var connectedUserId = Identity.GetConnectedUserId(httpContext);
            var connectedUserDetails = Identity.GetConnectedUserDetails(userManager, userId);
            return connectedUserDetails.Id == connectedUserId;
        }

    }

}
