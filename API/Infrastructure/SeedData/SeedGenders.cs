using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Genders;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseGenders {

        public static void SeedGenders(AppDbContext context) {
            if (!context.Genders.Any()) {
                if (!context.Genders.Any()) {
                    string gendersJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Genders.json");
                    List<Gender> genders = JsonConvert.DeserializeObject<List<Gender>>(gendersJSON);
                    context.Genders.AddRange(genders);
                    context.SaveChanges();
                }
            }
        }

    }

}