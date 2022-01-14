using System.Collections.Generic;
using System.Linq;
using API.Features.Ports;
using API.Infrastructure.Classes;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabasePorts {

        public static void SeedPorts(AppDbContext context) {
            if (!context.Ports.Any()) {
                List<Port> ports = new() {
                    new Port { Id = 1, Description = "CORFU PORT", IsPrimary = true, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Port { Id = 2, Description = "LEFKIMMI PORT", IsPrimary = false, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Port { Id = 3, Description = "INACTIVE PORT", IsPrimary = false, IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" }
                };
                context.AddRange(ports);
                context.SaveChanges();
            }
        }

    }

}