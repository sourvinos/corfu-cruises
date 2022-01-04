using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Destinations;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class SeedDatabaseDestinations {

        public static void SeedDestinations(AppDbContext context) {
            if (!context.Destinations.Any()) {
                List<Destination> destinations = new() {
                    new Destination { Id = 1, Abbreviation = "PA", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "PAXOS - ANTIPAXOS" },
                    new Destination { Id = 2, Abbreviation = "PAS", IsActive = true, UserId = "544c9930-ad76-4aa9-bb1c-8dd193508e05", Description = "PAXOS - ANTIPAXOS (SPACE SAFE)" },
                    new Destination { Id = 3, Abbreviation = "BL", IsActive = true, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "BLUE LAGOON" },
                    new Destination { Id = 4, Abbreviation = "BLS", IsActive = false, UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da", Description = "BLUE LAGOON (SPACE SAFE)" }
                };
                context.AddRange(destinations);
                context.SaveChanges();
            }
        }

    }

}