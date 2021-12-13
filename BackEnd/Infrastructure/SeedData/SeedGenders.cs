using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Genders;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseGenders {

        public static void SeedGenders(AppDbContext context) {
            if (!context.Genders.Any()) {
                List<Gender> genders = new() {
                    new Gender { Id = 1, Description = "MALE", IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).OrderBy(x => x.Id).Select(x => x.Id).SingleOrDefault() },
                    new Gender { Id = 2, Description = "FEMALE", IsActive = false, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).OrderBy(x => x.Id).Select(x => x.Id).SingleOrDefault() },
                    new Gender { Id = 3, Description = "OTHER", IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).OrderBy(x => x.Id).Select(x => x.Id).SingleOrDefault() }
                };
                context.AddRange(genders);
                context.SaveChanges();
            }
        }

    }

}