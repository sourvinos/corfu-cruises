using BlueWaterCruises;
using Microsoft.AspNetCore.Identity;

public static class SeedDatabaseUserRoles {

    public static async void SeedUserRoles(UserManager<AppUser> userManager) {
        foreach (var user in userManager.Users) {
            var result = await userManager.CreateAsync(user);
            if (result.Succeeded) {
                await userManager.AddToRoleAsync(user, user.IsAdmin ? "Admin" : "User");
            }
        }
    }

}