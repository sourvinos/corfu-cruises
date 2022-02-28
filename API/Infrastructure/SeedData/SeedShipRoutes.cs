using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.ShipRoutes;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseShipRoutes {

        public static void SeedShipRoutes(AppDbContext context) {
            if (!context.ShipRoutes.Any()) {
                string shipRoutesJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "ShipRoutes.json");
                List<ShipRoute> shipRoutes = JsonConvert.DeserializeObject<List<ShipRoute>>(shipRoutesJSON);
                context.ShipRoutes.AddRange(shipRoutes);
                context.SaveChanges();
            }
        }

    }

}