using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;

public static class SeedDatabaseRoles {

    public static void SeedRoles(RoleManager<IdentityRole> roleManager) {
        if (roleManager.Roles.Count() == 0) {
            var roles = new List<IdentityRole> {
                new IdentityRole { Id = "23497d7f-804b-4245-9e7b-ac8db606d454", Name = "admin", ConcurrencyStamp = "0ad0011a-055a-43ea-a909-a32ffc330095", NormalizedName = "ADMIN" },
                new IdentityRole { Id = "b36b0c1c-4db7-4ae0-85f5-043b6647bb3a", Name = "user", ConcurrencyStamp = "da9e667b-da55-4caa-a9b0-90dc0d00adcf", NormalizedName = "USER" }
            };
            foreach (var role in roles) {
                roleManager.CreateAsync(role).Wait();
            }
        }
    }

}