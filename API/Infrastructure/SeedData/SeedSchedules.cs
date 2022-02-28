using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Schedules;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseSchedules {

        public static void SeedSchedules(AppDbContext context) {
            if (!context.Schedules.Any()) {
                string schedulesJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Schedules.json");
                List<Schedule> schedules = JsonConvert.DeserializeObject<List<Schedule>>(schedulesJSON);
                context.Schedules.AddRange(schedules);
                context.SaveChanges();
            }
        }

    }

}