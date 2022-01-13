using System.Collections.Generic;
using System.Linq;
using API.Features.Routes;
using API.Infrastructure.Classes;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseRoutes {

        public static void SeedRoutes(AppDbContext context) {
            if (!context.Routes.Any()) {
                List<Route> routes = new() {
                    new Route { Id = 1, PortId = 1, Abbreviation = "CP", IsTransfer = false, IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "NO TRANSFER - CORFU PORT" },
                    new Route { Id = 2, PortId = 1, Abbreviation = "PAGOI", IsTransfer = true, IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "AG.STEFANOS - ARILLAS - PAGOI - CORFU PORT" },
                    new Route { Id = 3, PortId = 1, Abbreviation = "ACH-SID", IsTransfer = true, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "ACHARAVI - RODA - SIDARI - CORFU PORT" },
                    new Route { Id = 4, PortId = 1, Abbreviation = "NISAKI", IsTransfer = true, IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "NISAKI - KALAMI - BARBATI - DASIA - GOUVIA - CORFU PORT" },
                    new Route { Id = 5, PortId = 1, Abbreviation = "WEST", IsTransfer = true, IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "PALEO - ERMONES - GLYFADA - PELEKA - AG.GORDIS - CORFU PORT" },
                    new Route { Id = 6, PortId = 2, Abbreviation = "LP", IsTransfer = false, IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "NO TRANSFER - LEFKIMMI PORT" },
                    new Route { Id = 7, PortId = 2, Abbreviation = "KAVOS", IsTransfer = true, IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "KAVOS" },
                    new Route { Id = 8, PortId = 2, Abbreviation = "SOUTH", IsTransfer = true, IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "TOWN - PERAMA - MESONGHI - LEFKIMMI" },
                    new Route { Id = 9, PortId = 2, Abbreviation = "INR", IsTransfer = true, IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "INACTIVE ROUTE" },
                };
                context.AddRange(routes);
                context.SaveChanges();
            }
        }

    }

}