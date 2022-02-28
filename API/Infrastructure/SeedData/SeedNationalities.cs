using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Nationalities;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseNationalities {

        public static void SeedNationalities(AppDbContext context) {
            if (!context.Nationalities.Any()) {
                string nationalitiesJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Nationalities.json");
                List<Nationality> nationalities = JsonConvert.DeserializeObject<List<Nationality>>(nationalitiesJSON);
                context.Nationalities.AddRange(nationalities);
                context.SaveChanges();
            }
        }

    }

}