using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Crews;

namespace BlueWaterCruises {

    public static class SeedDatabaseCrews {

        public static void SeedCrews(AppDbContext context) {
            if (!context.Crews.Any()) {
                List<Crew> crews = new();
                for (int i = 1; i <= 20; i++) {
                    var crew = new Crew {
                        Lastname = Helpers.CreateRandomName().Split(" ")[0],
                        Firstname = Helpers.CreateRandomName().Split(" ")[1],
                        Birthdate = Helpers.CreateRandomDate(),
                        IsActive = Helpers.ConvertToBoolean(Helpers.CreateRandomInteger(0, 10)),
                        ShipId = context.Ships.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Ships.Count())).Take(1).Select(x => x.Id).SingleOrDefault(),
                        GenderId = context.Genders.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Genders.Count())).Take(1).Select(x => x.Id).FirstOrDefault(),
                        NationalityId = context.Nationalities.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Nationalities.Count())).Take(1).Select(x => x.Id).FirstOrDefault(),
                        UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault(),
                    };
                    crews.Add(crew);
                }
                context.AddRange(crews);
                context.SaveChanges();
            }
        }

    }

}