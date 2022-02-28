using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Routes;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseRoutes {

        public static void SeedRoutes(AppDbContext context) {
            if (!context.Routes.Any()) {
                string routesJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Routes.json");
                List<Route> routes = JsonConvert.DeserializeObject<List<Route>>(routesJSON);
                context.Routes.AddRange(routes);
                context.SaveChanges();
            }
        }

    }

}