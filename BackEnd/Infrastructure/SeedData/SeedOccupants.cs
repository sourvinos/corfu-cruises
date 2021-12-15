using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Occupants;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseOccupants {

        public static void SeedOccupants(AppDbContext context) {
            if (!context.Occupants.Any()) {
                List<Occupant> occupants = new() {
                    new Occupant { Id = 1, Description = "CREW", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" },
                    new Occupant { Id = 2, Description = "PASSENGER", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da" }
                };
                context.AddRange(occupants);
                context.SaveChanges();
            }
        }

    }

}