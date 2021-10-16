using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using Microsoft.AspNetCore.Identity;

public static class SeedDatabaseUsers {

    public static async void SeedUsers(UserManager<AppUser> userManager) {
        if (userManager.Users.Count() == 0) {
            var users = new List<AppUser> {
                new AppUser { Id = "e7e014fd-5608-4936-866e-ec11fc8c16da", UserName = "sourvinos", EmailConfirmed = true, Email = "johnsourvinos@hotmail.com", DisplayName = "Sourvinos", IsAdmin = true, CustomerId = 1, IsActive = true, PasswordHash = new PasswordHasher<AppUser>().HashPassword(new AppUser(), "PasswordWouldBeHere") },
                new AppUser { Id = "72229c75-b9b5-4fe8-8ebe-d02322809650", UserName = "user", EmailConfirmed = true, Email = "gatopoulidis@gmail.com", DisplayName = "User", IsAdmin = false, CustomerId = 1, IsActive = true, PasswordHash = new PasswordHasher<AppUser>().HashPassword(new AppUser(), "PasswordWouldBeHere") },
                new AppUser { Id = "544c9930-ad76-4aa9-bb1c-8dd193508e05", UserName = "nikoleta", EmailConfirmed = true, Email = "nikoleta@gmail.com", DisplayName = "Nikoleta", IsAdmin = false, CustomerId = 1, IsActive = true, PasswordHash = new PasswordHasher<AppUser>().HashPassword(new AppUser(), "PasswordWouldBeHere") },
                new AppUser { Id = "4fcd7909-0569-45d9-8b78-2b24a7368e19", UserName = "maria", EmailConfirmed = true, Email = "maria@gmail.com", DisplayName = "Maria", IsAdmin = true, CustomerId = 1, IsActive = true, PasswordHash = new PasswordHasher<AppUser>().HashPassword(new AppUser(), "PasswordWouldBeHere") },
                new AppUser { Id = "7b8326ad-468f-4dbd-bf6d-820343d9e828", UserName = "matoula", EmailConfirmed = true, Email = "matoula@gmail.com", DisplayName = "Matoula", IsAdmin = false, CustomerId = 1, IsActive = true, PasswordHash = new PasswordHasher<AppUser>().HashPassword(new AppUser(), "PasswordWouldBeHere") }
            };
            foreach (var user in users) {
                var result = await userManager.CreateAsync(user);
                if (result.Succeeded) {
                    await userManager.AddToRoleAsync(user, user.IsAdmin ? "Admin" : "User");
                }
            }
        }
    }

}