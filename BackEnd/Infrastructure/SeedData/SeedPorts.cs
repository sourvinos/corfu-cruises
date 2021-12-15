using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabasePorts {

        public static void SeedPorts(AppDbContext context) {
            if (!context.Ports.Any()) {
                List<Port> ports = new() {
                    new Port { Id = 1, Description = "CORFU PORT", IsPrimary = true, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Port { Id = 2, Description = "LEFKIMMI PORT", IsPrimary = false, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" }
                };
                context.AddRange(ports);
                context.SaveChanges();
            }
        }

    }

}