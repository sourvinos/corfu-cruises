using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Drivers;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseDrivers {

        public static void SeedDrivers(AppDbContext context) {
            if (!context.Drivers.Any()) {
                string driversJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Drivers.json");
                List<Driver> drivers = JsonConvert.DeserializeObject<List<Driver>>(driversJSON);
                context.Drivers.AddRange(drivers);
                context.SaveChanges();
            }
        }

    }

}