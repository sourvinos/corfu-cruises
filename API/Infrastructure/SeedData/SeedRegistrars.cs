using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Registrars;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseRegistrars {

        public static void SeedRegistrars(AppDbContext context) {
            if (!context.Registrars.Any()) {
                string registrarsJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Registrars.json");
                List<Registrar> registrars = JsonConvert.DeserializeObject<List<Registrar>>(registrarsJSON);
                context.Registrars.AddRange(registrars);
                context.SaveChanges();
            }
        }

    }

}