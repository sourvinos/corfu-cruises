using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Drivers;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseDrivers {

        public static void SeedDrivers(AppDbContext context) {
            if (!context.Drivers.Any()) {
                List<Driver> drivers = new() {
                    new Driver { Id = 1, Phones = "505-635-2346", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "ALISE PAPE" },
                    new Driver { Id = 2, Phones = "304-923-1193", IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "ALISE PAPE" },
                    new Driver { Id = 3, Phones = "202-938-6679", IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "JAZLENE BOSTWICK" },
                    new Driver { Id = 4, Phones = "406-933-0135", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "GASTON SMITHERS" },
                    new Driver { Id = 5, Phones = "582-282-1230", IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "ARIN FLESHER" },
                    new Driver { Id = 6, Phones = "582-400-6729", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "ALISE PAPE" },
                    new Driver { Id = 7, Phones = "609-790-8062", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "JAZLENE BOSTWICK" },
                    new Driver { Id = 8, Phones = "582-282-0704", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "GASTON SMITHERS" },
                    new Driver { Id = 9, Phones = "582-282-2457", IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "IVYONNA WENNER" },
                    new Driver { Id = 10, Phones = "582-465-8638", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "ALISE PAPE" },
                    new Driver { Id = 11, Phones = "505-635-2346", IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "JAZLENE BOSTWICK" },
                    new Driver { Id = 12, Phones = "248-462-6749", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "ALISE PAPE" },
                    new Driver { Id = 13, Phones = "582-400-6729", IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "JALIAH BRENNEMAN " },
                    new Driver { Id = 14, Phones = "248-462-6749", IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "ALISE PAPE" },
                    new Driver { Id = 15, Phones = "582-400-1351", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "JALIAH BRENNEMAN " },
                    new Driver { Id = 16, Phones = "505-574-7992", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "ALIZA PERALTA" },
                    new Driver { Id = 17, Phones = "582-465-8638", IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "ALIZA PERALTA" },
                    new Driver { Id = 18, Phones = "406-933-0135", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "JAZLENE BOSTWICK" },
                    new Driver { Id = 19, Phones = "404-930-0672", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "SIRIUS RHYNE" },
                    new Driver { Id = 20, Phones = "404-930-0672", IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "ALISE PAPE" }
                };
                context.AddRange(drivers);
                context.SaveChanges();
            }
        }

    }

}