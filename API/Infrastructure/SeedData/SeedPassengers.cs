using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabasePassengers {

        public static void SeedPassengers(AppDbContext context) {
            if (!context.Passengers.Any()) {
                string passengersJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Passengers.json");
                List<Passenger> passengers = JsonConvert.DeserializeObject<List<Passenger>>(passengersJSON);
                context.Passengers.AddRange(passengers);
                context.SaveChanges();
            }
        }
    }

}