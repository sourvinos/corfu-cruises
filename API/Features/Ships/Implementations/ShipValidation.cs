using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.Extensions.Options;

namespace API.Features.Ships {

    public class ShipValidation : Repository<Ship>, IShipValidation {

        public ShipValidation(AppDbContext appDbContext, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) { }

        public int IsValid(ShipWriteDto ship) {
            return true switch {
                var x when x == !IsValidShipOwner(ship) => 449,
                _ => 200,
            };
        }

        private bool IsValidShipOwner(ShipWriteDto ship) {
            return ship.Id == 0 
                ? context.ShipOwners.SingleOrDefault(x => x.Id == ship.ShipOwnerId && x.IsActive) != null 
                : context.ShipOwners.SingleOrDefault(x => x.Id == ship.ShipOwnerId) != null;
        }

    }

}