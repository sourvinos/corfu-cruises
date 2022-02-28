using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Destinations;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseDestinations {

        public static void SeedDestinations(AppDbContext context) {
            if (!context.Destinations.Any()) {
                string destinationsJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Destinations.json");
                List<Destination> destinations = JsonConvert.DeserializeObject<List<Destination>>(destinationsJSON);
                context.Destinations.AddRange(destinations);
                context.SaveChanges();
            }
        }

    }

}