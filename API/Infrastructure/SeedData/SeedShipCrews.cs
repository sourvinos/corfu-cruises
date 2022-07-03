using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.ShipCrews;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseShipCrews {

        public static void SeedShipCrews(AppDbContext context) {
            if (!context.ShipCrews.Any()) {
                string crewsJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Crews.json");
                List<ShipCrew> crews = JsonConvert.DeserializeObject<List<ShipCrew>>(crewsJSON);
                context.ShipCrews.AddRange(crews);
                context.SaveChanges();
            }
        }

    }

}