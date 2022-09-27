using System.Linq;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.Extensions.Options;

namespace API.Features.PickupPoints {

    public class PickupPointValidation : Repository<PickupPoint>, IPickupPointValidation {

        public PickupPointValidation(AppDbContext appDbContext, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) { }

        public int IsValid(PickupPointWriteDto pickupPoint) {
            return true switch {
                var x when x == !IsValidRoute(pickupPoint) => 408,
                _ => 200,
            };
        }

        private bool IsValidRoute(PickupPointWriteDto pickupPoint) {
            return pickupPoint.Id == 0
                ? context.CoachRoutes.SingleOrDefault(x => x.Id == pickupPoint.CoachRouteId && x.IsActive) != null
                : context.CoachRoutes.SingleOrDefault(x => x.Id == pickupPoint.CoachRouteId) != null;
        }

    }

}