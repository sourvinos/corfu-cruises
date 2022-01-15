using System.Collections.Generic;
using System.Linq;
using API.Features.ShipRoutes;
using API.Infrastructure.Classes;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseShipRoutes {

        public static void SeedShipRoutes(AppDbContext context) {
            if (!context.ShipRoutes.Any()) {
                List<ShipRoute> shipRoutes = new() {
                    new ShipRoute { Id = 1, Description = "CORFU - LEFKIMMI - PAXOS", FromPort = "CORFU", FromTime = "08:10", ViaPort = "LEFKIMMI", ViaTime = "09:00", ToPort = "PAXOS", ToTime = "10:30", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new ShipRoute { Id = 2, Description = "BENITSES - BLUE LAGOON", FromPort = "BENITSES", FromTime = "08:30", ViaPort = "", ViaTime = "", ToPort = "BLUE LAGOON", ToTime = "09:30", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new ShipRoute { Id = 3, Description = "BENITSES - LEFKIMMI - PAXOS", FromPort = "BENITSES", FromTime = "08:30", ViaPort = "LEFKIMMI", ViaTime = "09:15", ToPort = "PAXOS", ToTime = "10:15", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" }
                };
                context.AddRange(shipRoutes);
                context.SaveChanges();
            }
        }

    }

}