using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.CoachRoutes;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseRoutes {

        public static void SeedCoachRoutes(AppDbContext context) {
            if (!context.CoachRoutes.Any()) {
                string routesJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "CoachRoutes.json");
                List<CoachRoute> coachRoutes = JsonConvert.DeserializeObject<List<CoachRoute>>(routesJSON);
                context.CoachRoutes.AddRange(coachRoutes);
                context.SaveChanges();
            }
        }

    }

}