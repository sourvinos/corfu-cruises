using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Ships;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseShips {

        public static void SeedShips(AppDbContext context) {
            if (!context.Ships.Any()) {
                string shipsJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Ships.json");
                List<Ship> ships = JsonConvert.DeserializeObject<List<Ship>>(shipsJSON);
                context.Ships.AddRange(ships);
                context.SaveChanges();
            }
        }

    }

}