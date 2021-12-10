using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Destinations;

namespace BlueWaterCruises {

    public static class SeedDatabaseDestinations {

        public static void SeedDestinations(AppDbContext context) {
            if (!context.Destinations.Any()) {
                var destinations = new List<Destination> {
                new Destination { Id = 1, Abbreviation = "PA", Description = "PAXOS - ANTIPAXOS", IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                new Destination { Id = 2, Abbreviation = "PAS", Description = "PAXOS - ANTIPAXOS (SPACE SAFE)", IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                new Destination { Id = 3, Abbreviation = "BL", Description = "BLUE LAGOON", IsActive = false, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() },
                new Destination { Id = 4, Abbreviation = "BLS", Description = "BLUE LAGOON (SPACE SAFE)", IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() }
            };
                context.AddRange(destinations);
                context.SaveChanges();
            }
        }

    }

}