using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Drivers;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseDrivers {

        public static void SeedDrivers(AppDbContext context) {
            if (!context.Drivers.Any()) {
                List<Driver> drivers = new();
                for (int i = 1; i <= 20; i++) {
                    var driver = new Driver {
                        Description = Helpers.CreateRandomDrivers(),
                        Phones = Helpers.CreateRandomPhones(),
                        IsActive = Helpers.ConvertToBoolean(Helpers.CreateRandomInteger(0, 10)),
                        UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault()
                    };
                    drivers.Add(driver);
                }
                context.AddRange(drivers);
                context.SaveChanges();
            }
        }

    }

}