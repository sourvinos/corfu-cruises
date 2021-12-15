using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Genders;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseGenders {

        public static void SeedGenders(AppDbContext context) {
            if (!context.Genders.Any()) {
                List<Gender> genders = new() {
                    new Gender { Id = 1, Description = "MALE", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Gender { Id = 2, Description = "FEMALE", IsActive = false, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05" },
                    new Gender { Id = 3, Description = "OTHER", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" }
                };
                context.AddRange(genders);
                context.SaveChanges();
            }
        }

    }

}