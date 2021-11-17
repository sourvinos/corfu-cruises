
using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using BlueWaterCruises.Features.ShipRoutes;

public static class SeedDatabaseShipRoutes {

    public static void SeedShipRoutes(AppDbContext context) {
        if (context.ShipRoutes.Count() == 0) {
            var shipRoutes = new List<ShipRoute> {
                new ShipRoute { Id = 1, Description = "CORFU - LEFKIMMI - PAXOS", FromPort = "CORFU", FromTime = "08:10", ViaPort = "LEFKIMMI", ViaTime = "09:00", ToPort = "PAXOS", ToTime = "10:30", IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                new ShipRoute { Id = 2, Description = "BENITSES - BLUE LAGOON", FromPort = "BENITSES", FromTime = "08:30", ViaPort = "", ViaTime = "", ToPort = "BLUE LAGOON", ToTime = "09:30", IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                new ShipRoute { Id = 3, Description = "BENITSES - LEFKIMMI - PAXOS", FromPort = "BENITSES", FromTime = "08:30", ViaPort = "LEFKIMMI", ViaTime = "09:15", ToPort = "PAXOS", ToTime = "10:15", IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() }
            };
            context.AddRange(shipRoutes);
            context.SaveChanges();
        }
    }

}