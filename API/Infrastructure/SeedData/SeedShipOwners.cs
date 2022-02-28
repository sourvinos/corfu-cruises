using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.ShipOwners;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseShipOwners {

        public static void SeedShipOwners(AppDbContext context) {
            if (!context.ShipOwners.Any()) {
                string shipOwnersJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "ShipOwners.json");
                List<ShipOwner> shipOwners = JsonConvert.DeserializeObject<List<ShipOwner>>(shipOwnersJSON);
                context.ShipOwners.AddRange(shipOwners);
                context.SaveChanges();
            }
        }

    }

}