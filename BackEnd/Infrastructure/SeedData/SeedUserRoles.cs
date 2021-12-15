using BlueWaterCruises.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseUserRoles {

        public static async void SeedUserRoles(UserManager<UserExtended> userManager) {
            foreach (var user in userManager.Users) {
                var result = await userManager.CreateAsync(user);
                if (result.Succeeded) {
                    await userManager.AddToRoleAsync(user, user.IsAdmin ? "Admin" : "User");
                }
            }
        }

    }

}