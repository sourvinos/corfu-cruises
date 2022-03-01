using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseRoles {

        public static void SeedRoles(RoleManager<IdentityRole> roleManager) {
            if (!roleManager.Roles.Any()) {
                string rolesJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Roles.json");
                foreach (var role in JsonConvert.DeserializeObject<List<IdentityRole>>(rolesJSON)) {
                    roleManager.CreateAsync(role).Wait();
                }
            }
        }

    }

}