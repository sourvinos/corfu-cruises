using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Features.Customers;
using API.Infrastructure.Classes;
using Newtonsoft.Json;

namespace API.Infrastructure.SeedData {

    public static class SeedDatabaseCustomers {

        public static void SeedCustomers(AppDbContext context) {
            if (!context.Customers.Any()) {
                string customersJSON = File.ReadAllText("Infrastructure" + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "Customers.json");
                List<Customer> customers = JsonConvert.DeserializeObject<List<Customer>>(customersJSON);
                context.Customers.AddRange(customers);
                context.SaveChanges();
            }
        }

    }

}