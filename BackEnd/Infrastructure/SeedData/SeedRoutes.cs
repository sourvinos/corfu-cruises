using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Routes;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseRoutes {

        public static void SeedRoutes(AppDbContext context) {
            if (!context.Routes.Any()) {
                List<Route> routes = new() {
                    new Route { PortId = 2, Abbreviation = "NISAKI", IsTransfer = true, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault(), Description = "NISAKI - KALAMI - BARBATI - DASIA - GOUVIA - CORFU PORT" },
                    new Route { PortId = 2, Abbreviation = "SOUTH", IsTransfer = true, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault(), Description = "TOWN - ΠΕΡΑΜΑ - ΜΕΣΣΟΓΓΗ - ΛΕΥΚΙΜΜΗ" },
                    new Route { PortId = 1, Abbreviation = "WEST", IsTransfer = true, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault(), Description = "PALEO - ERMONES - GLYFADA - PELEKA - AG.GORDIS - CORFU PORT" },
                    new Route { PortId = 1, Abbreviation = "ACH-SID", IsTransfer = true, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault(), Description = "ACHARAVI - RODA - SIDARI - CORFU PORT" },
                    new Route { PortId = 2, Abbreviation = "KAVOS", IsTransfer = true, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault(), Description = "KAVOS" },
                    new Route { PortId = 2, Abbreviation = "LP", IsTransfer = false, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault(), Description = "NO TRANSFER - LEFKIMMI PORT" },
                    new Route { PortId = 1, Abbreviation = "PAGOI", IsTransfer = true, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault(), Description = "AG.STEFANOS - ARILLAS - PAGOI - CORFU PORT" },
                    new Route { PortId = 1, Abbreviation = "CP", IsTransfer = false, IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault(), Description = "NO TRANSFER - CORFU PORT" }
                };
                context.AddRange(routes);
                context.SaveChanges();
            }
        }

    }

}