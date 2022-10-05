using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.Extensions.Options;

namespace API.Features.ShipCrews {

    public class ShipCrewValidation : Repository<ShipCrew>, IShipCrewValidation {

        public ShipCrewValidation(AppDbContext appDbContext, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) { }

        public int IsValid(ShipCrewWriteDto shipCrew) {
            return true switch {
                var x when x == !IsValidGender(shipCrew) => 457,
                var x when x == !IsValidNationality(shipCrew) => 456,
                var x when x == !IsValidShip(shipCrew) => 454,
                _ => 200,
            };
        }

        private bool IsValidGender(ShipCrewWriteDto shipCrew) {
            return shipCrew.Id == 0
                ? context.Genders.SingleOrDefault(x => x.Id == shipCrew.GenderId && x.IsActive) != null
                : context.Genders.SingleOrDefault(x => x.Id == shipCrew.GenderId) != null;
        }

        private bool IsValidNationality(ShipCrewWriteDto shipCrew) {
            return shipCrew.Id == 0
                ? context.Nationalities.SingleOrDefault(x => x.Id == shipCrew.NationalityId && x.IsActive) != null
                : context.Nationalities.SingleOrDefault(x => x.Id == shipCrew.NationalityId) != null;
        }

        private bool IsValidShip(ShipCrewWriteDto shipCrew) {
            return shipCrew.Id == 0
                ? context.Ships.SingleOrDefault(x => x.Id == shipCrew.ShipId && x.IsActive) != null
                : context.Ships.SingleOrDefault(x => x.Id == shipCrew.ShipId) != null;
        }

    }

}