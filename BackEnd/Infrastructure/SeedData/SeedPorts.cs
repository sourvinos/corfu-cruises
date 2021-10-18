using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using BlueWaterCruises.Features.Ports;

public static class SeedDatabasePorts {

    public static void SeedPorts(AppDbContext context) {
        if (context.Ports.Count() == 0) {
            var ports = new List<Port> {
                new Port { Id = 1, Description = "CORFU PORT", IsPrimary = true, IsActive = true, UserId = context.Users.Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                new Port { Id = 2, Description = "LEFKIMMI PORT", IsPrimary = false, IsActive = true, UserId = context.Users.Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() }
            };
            context.AddRange(ports);
            context.SaveChanges();
        }
    }

}