using System.Collections.Generic;
using System.Linq;
using API.Features.Ships;
using API.Infrastructure.Classes;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseShips {

        public static void SeedShips(AppDbContext context) {
            if (!context.Ships.Any()) {
                List<Ship> ships = new() {
                    new Ship { Id = 1, Description = "MOBY DICK", ShipOwnerId = 1, IMO = "748596", Flag = "GREEK", RegistryNo = "3651", Manager = "JOHN DOE", ManagerInGreece = "JANE DOE", Agent = "JACK DOE", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Ship { Id = 2, Description = "MOBY DICK II", ShipOwnerId = 1, IMO = "632145", Flag = "GREEK", RegistryNo = "7469", Manager = "JOHN DOE", ManagerInGreece = "JANE DOE", Agent = "JACK DOE", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Ship { Id = 3, Description = "EVENING STAR", ShipOwnerId = 1, IMO = "745236", Flag = "GREEK", RegistryNo = "6142", Manager = "JOHN DOE", ManagerInGreece = "JANE DOE", Agent = "JACK DOE", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" }
                };
                context.AddRange(ships);
                context.SaveChanges();
            }
        }

    }

}