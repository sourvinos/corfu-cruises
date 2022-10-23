using System.Linq;
using API.Infrastructure.Classes;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Users {

    public class UserUpdateValidation : IUserUpdateValidation {

        private readonly AppDbContext context;

        public UserUpdateValidation(AppDbContext context) {
            this.context = context;
        }

        public int IsValid(UserUpdateDto user) {
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
