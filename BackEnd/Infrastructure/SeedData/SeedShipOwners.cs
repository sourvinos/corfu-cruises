using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises.Features.Ships;

namespace BlueWaterCruises {

    public static class SeedDatabaseShipOwners {

        public static void SeedShipOwners(AppDbContext context) {
            if (!context.ShipOwners.Any()) {
                var shipOwners = new List<ShipOwner> {
                new ShipOwner { Id = 1, Description = "MOBY DICK CRUISES", Profession = "SHIPPING COMPANY", Address = "KAVOS MAIN STREET", TaxNo = "EL 999999999", City = "KAVOS", Phones = "+30 26620 12345", Email = "email@server.com", IsActive = true, UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault() }
            };
                context.AddRange(shipOwners);
                context.SaveChanges();
            }
        }

    }

}