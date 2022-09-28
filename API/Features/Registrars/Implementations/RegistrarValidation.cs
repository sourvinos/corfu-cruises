using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.Extensions.Options;

namespace API.Features.Registrars {

    public class RegistrarValidation : Repository<Registrar>, IRegistrarValidation {

        public RegistrarValidation(AppDbContext appDbContext, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) { }

        public int IsValid(RegistrarWriteDto registrar) {
            return true switch {
                var x when x == !IsValidShip(registrar) => 454,
                _ => 200,
            };
        }

        private bool IsValidShip(RegistrarWriteDto registrar) {
            return registrar.Id == 0
                ? context.Ships.SingleOrDefault(x => x.Id == registrar.ShipId && x.IsActive) != null
                : context.Ships.SingleOrDefault(x => x.Id == registrar.ShipId) != null;
        }

    }

}