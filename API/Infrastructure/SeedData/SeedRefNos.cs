using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseRefNos {

        public static void SeedRefNos(AppDbContext context) {
            if (!context.RefNos.Any()) {
                string refNosJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "RefNos.json");
                List<RefNo> refNos = JsonConvert.DeserializeObject<List<RefNo>>(refNosJSON);
                context.RefNos.AddRange(refNos);
                context.SaveChanges();
            }
        }

    }

}