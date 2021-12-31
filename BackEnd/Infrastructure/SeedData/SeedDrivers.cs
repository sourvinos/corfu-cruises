using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Drivers;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseDrivers {

        public static void SeedDrivers(AppDbContext context) {
            if (!context.Drivers.Any()) {
                List<Driver> drivers = new() {
                    new Driver { Id = 01, Description = "ALISE PAPE", Phones = "248-462-6749", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Driver { Id = 02, Description = "ALIZA PERALTA", Phones = "505-574-7992", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Driver { Id = 03, Description = "ARIN FLESHER", Phones = "582-282-1230", IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Driver { Id = 04, Description = "GASTON SMITHERS", Phones = "406-933-0135", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Driver { Id = 05, Description = "IVYONNA WENNER", Phones = "582-282-2457", IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Driver { Id = 06, Description = "JALIAH BRENNEMAN", Phones = "582-400-6729", IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Driver { Id = 07, Description = "JAZLENE BOSTWICK", Phones = "609-790-8062", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Driver { Id = 08, Description = "SIRIUS RHYNE", Phones = "404-930-0672", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                };
                context.AddRange(drivers);
                context.SaveChanges();
            }
        }

    }

}