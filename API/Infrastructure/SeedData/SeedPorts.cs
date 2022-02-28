using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Ports;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabasePorts {

        public static void SeedPorts(AppDbContext context) {
            if (!context.Ports.Any()) {
                string portsJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Ports.json");
                List<Port> ports = JsonConvert.DeserializeObject<List<Port>>(portsJSON);
                context.Ports.AddRange(ports);
                context.SaveChanges();
            }
        }

    }

}