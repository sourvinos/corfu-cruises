using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseReservations {

        public static void SeedReservations(AppDbContext context) {
            if (!context.Reservations.Any()) {
                string reservationsJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Reservations.json");
                List<Reservation> reservations = JsonConvert.DeserializeObject<List<Reservation>>(reservationsJSON);
                context.Reservations.AddRange(reservations);
                context.SaveChanges();
            }
        }

    }

}