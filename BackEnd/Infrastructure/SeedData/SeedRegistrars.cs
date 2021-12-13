using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Ships.Registrars;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseRegistrars {

        public static void SeedRegistrars(AppDbContext context) {
            if (!context.Registrars.Any()) {
                List<Registrar> registrars = new();
                for (int i = 1; i <= 6; i++) {
                    var registrar = new Registrar {
                        ShipId = context.Ships.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Ships.Count())).Take(1).Select(x => x.Id).SingleOrDefault(),
                        Fullname = Helpers.CreateRandomName(),
                        Phones = Helpers.CreateRandomPhones(),
                        Email = Helpers.CreateRandomEmail(),
                        Fax = "",
                        Address = Helpers.CreateRandomAddress(),
                        IsPrimary = Helpers.ConvertToBoolean(Helpers.CreateRandomInteger(0, 10)),
                        IsActive = Helpers.ConvertToBoolean(Helpers.CreateRandomInteger(0, 10)),
                        UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault()
                    };
                    registrars.Add(registrar);
                }
                context.AddRange(registrars);
                context.SaveChanges();
            }
        }

    }

}