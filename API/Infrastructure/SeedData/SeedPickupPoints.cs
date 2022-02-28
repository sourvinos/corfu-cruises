using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.PickupPoints;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabasePickupPoints {

        public static void SeedPickupPoints(AppDbContext context) {
            if (!context.PickupPoints.Any()) {
                string pickupPointsJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "PickupPoints.json");
                List<PickupPoint> pickupPoints = JsonConvert.DeserializeObject<List<PickupPoint>>(pickupPointsJSON);
                context.PickupPoints.AddRange(pickupPoints);
                context.SaveChanges();
            }
        }

    }

}