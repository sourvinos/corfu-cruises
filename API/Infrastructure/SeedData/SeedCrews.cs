using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.ShipCrews;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseCrews {

        public static void SeedCrews(AppDbContext context) {
            if (!context.Crews.Any()) {
                string crewsJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Crews.json");
                List<Crew> crews = JsonConvert.DeserializeObject<List<Crew>>(crewsJSON);
                context.Crews.AddRange(crews);
                context.SaveChanges();
            }
        }

    }

}