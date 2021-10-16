using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using BlueWaterCruises.Features.Ships;

public static class SeedDatabaseShips {

    public static void SeedShips(AppDbContext context) {
        if (context.Ships.Count() == 0) {
            var ships = new List<Ship> { 
                new Ship { Id = 1, Description = "MOBY DICK", ShipOwnerId = 1, IMO = "748596", Flag = "GREEK", RegistryNo = "3651", Manager = "JOHN DOE", ManagerInGreece = "JANE DOE", Agent = "JACK DOE", IsActive = true, UserId = context.Users.Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                new Ship { Id = 2, Description = "MOBY DICK II", ShipOwnerId = 1, IMO = "632145", Flag = "GREEK", RegistryNo = "7469", Manager = "JOHN DOE", ManagerInGreece = "JANE DOE", Agent = "JACK DOE", IsActive = false, UserId = context.Users.Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() }
            };
            context.AddRange(ships);
            context.SaveChanges();
        }
    }

}