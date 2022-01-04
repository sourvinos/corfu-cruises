using System;
using System.Linq;
using API.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseUsers {

        public static void SeedUsers(UserManager<UserExtended> userManager) {
            if (!userManager.Users.Any()) {
                // Admin = 0, Active = 0
                UserExtended marios = new() {
                    Id = "4fcd7909-0569-45d9-8b78-2b24a7368e19",
                    UserName = "marios",
                    EmailConfirmed = true,
                    Email = "marios@outlook.com",
                    DisplayName = "Marios",
                    IsAdmin = false,
                    CustomerId = 1,
                    IsActive = false,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                IdentityResult resultForMarios = userManager.CreateAsync(marios, "2b24a7368e19").Result;
                if (resultForMarios.Succeeded) {
                    userManager.AddToRoleAsync(marios, marios.IsAdmin ? "admin" : "user").Wait();
                }
                // Admin = 0, Active = 1
                UserExtended matoula = new() {
                    Id = "7b8326ad-468f-4dbd-bf6d-820343d9e828",
                    UserName = "matoula",
                    EmailConfirmed = true,
                    Email = "matoula@aol.com",
                    DisplayName = "Matoula",
                    IsAdmin = false,
                    CustomerId = 2,
                    IsActive = true,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                IdentityResult resultForMatoula = userManager.CreateAsync(matoula, "820343d9e828").Result;
                if (resultForMatoula.Succeeded) {
                    userManager.AddToRoleAsync(matoula, matoula.IsAdmin ? "admin" : "user").Wait();
                }
                // Admin = 1, Active = 1
                UserExtended john = new() {
                    Id = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    UserName = "john",
                    EmailConfirmed = true,
                    Email = "john@hotmail.com",
                    DisplayName = "John",
                    IsAdmin = true,
                    CustomerId = 1,
                    IsActive = true,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                IdentityResult resultForJohn = userManager.CreateAsync(john, "ec11fc8c16da").Result;
                if (resultForJohn.Succeeded) {
                    userManager.AddToRoleAsync(john, john.IsAdmin ? "admin" : "user").Wait();
                }
                // Admin = 1, Active = 0
                UserExtended nikoleta = new() {
                    Id = "544c9930-ad76-4aa9-bb1c-8dd193508e05",
                    UserName = "nikoleta",
                    EmailConfirmed = true,
                    Email = "nikoleta@gmail.com",
                    DisplayName = "Nikoleta",
                    IsAdmin = true,
                    CustomerId = 1,
                    IsActive = false,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                IdentityResult resultForNikoleta = userManager.CreateAsync(nikoleta, "8dd193508e05").Result;
                if (resultForNikoleta.Succeeded) {
                    userManager.AddToRoleAsync(nikoleta, nikoleta.IsAdmin ? "admin" : "user").Wait();
                }
            }
        }

    }

}