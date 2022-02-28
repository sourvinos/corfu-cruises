using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Occupants;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseOccupants {

        public static void SeedOccupants(AppDbContext context) {
            if (!context.Occupants.Any()) {
                string occupantsJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Occupants.json");
                List<Occupant> occupants = JsonConvert.DeserializeObject<List<Occupant>>(occupantsJSON);
                context.Occupants.AddRange(occupants);
                context.SaveChanges();
            }
        }

    }

}