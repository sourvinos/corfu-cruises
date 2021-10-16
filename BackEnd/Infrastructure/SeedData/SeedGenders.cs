using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using BlueWaterCruises.Features.Genders;

public static class SeedDatabaseGenders {

    public static void SeedGenders(AppDbContext context) {
        if (context.Genders.Count() == 0) {
            var genders = new List<Gender> {
                new Gender { Id = 1, Description= "MALE", IsActive = true, UserId = context.Users.Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                new Gender { Id = 2, Description= "FEMALE", IsActive = false, UserId = context.Users.Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault()},
                new Gender { Id = 3, Description= "OTHER", IsActive = true, UserId = context.Users.Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() }
            };
            context.AddRange(genders);
            context.SaveChanges();
        }
    }

}