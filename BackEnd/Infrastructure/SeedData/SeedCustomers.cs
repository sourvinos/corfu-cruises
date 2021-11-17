using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using BlueWaterCruises.Features.Customers;

public static class SeedDatabaseCustomers {

    public static void SeedCustomers(AppDbContext context) {
        if (context.Customers.Count() == 0) {
            List<Customer> customers = new();
            for (int i = 1; i <= 20; i++) {
                var customer = new Customer {
                    Description = Helpers.CreateRandomCustomers(),
                    Profession = Helpers.CreateRandomOccupations(),
                    Address = Helpers.CreateRandomAddress(),
                    Phones = Helpers.CreateRandomPhones(),
                    PersonInCharge = Helpers.CreateRandomPersonsInCharge(),
                    Email = Helpers.CreateRandomEmail(),
                    IsActive = Helpers.ConvertToBoolean(Helpers.CreateRandomInteger(0, 10)),
                    UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault()
                };
                customers.Add(customer);
            }
            context.AddRange(customers);
            context.SaveChanges();
        }
    }

}