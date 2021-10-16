using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using BlueWaterCruises.Features.Drivers;

public static class SeedDatabaseDrivers {

    public static void SeedDrivers(AppDbContext context) {
        if (context.Drivers.Count() == 0) {
            List<Driver> drivers = new();
            for (int i = 1; i <= 20; i++) {
                var customer = new Driver {
                    Description = Helpers.CreateRandomDrivers(),
                    Phones = Helpers.CreateRandomPhones(),
                    IsActive = Helpers.ConvertToBoolean(Helpers.CreateRandomInteger(0, 10)),
                    UserId = context.Users.Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault()
                };
                drivers.Add(customer);
            }
            context.AddRange(drivers);
            context.SaveChanges();
        }
    }

}