using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using BlueWaterCruises.Features.Ships;

public static class SeedDatabaseCrews {

    public static void SeedCrews(AppDbContext context) {
        if (context.Crews.Count() == 0) {
            List<Crew> crews = new();
            for (int i = 1; i <= 20; i++) {
                var crew = new Crew {
                    Lastname = Helpers.CreateRandomName().Split(" ")[0],
                    Firstname = Helpers.CreateRandomName().Split(" ")[1],
                    Birthdate = Helpers.CreateRandomDate(),
                    IsActive = Helpers.ConvertToBoolean(Helpers.CreateRandomInteger(0, 10)),
                    ShipId = context.Ships.Skip(Helpers.CreateRandomInteger(0, context.Ships.Count())).Take(1).Select(x => x.Id).SingleOrDefault(),
                    GenderId = context.Genders.Skip(Helpers.CreateRandomInteger(0, context.Genders.Count())).Take(1).Select(x => x.Id).FirstOrDefault(),
                    NationalityId = context.Nationalities.Skip(Helpers.CreateRandomInteger(0, context.Nationalities.Count())).Take(1).Select(x => x.Id).FirstOrDefault(),
                    UserId = context.Users.Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault(),
                };
                crews.Add(crew);
            }
            context.AddRange(crews);
            context.SaveChanges();
        }
    }

}