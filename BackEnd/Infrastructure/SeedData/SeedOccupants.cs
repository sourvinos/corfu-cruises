using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using BlueWaterCruises.Features.Occupants;

public static class SeedDatabaseOccupants {

    public static void SeedOccupants(AppDbContext context) {
        if (context.Occupants.Count() == 0) {
            var occupants = new List<Occupant> {
                new Occupant { Id = 1, Description= "CREW", IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                new Occupant { Id = 2, Description= "PASSENGER", IsActive = false, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() }
            };
            context.AddRange(occupants);
            context.SaveChanges();
        }
    }

}