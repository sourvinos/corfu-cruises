using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.PickupPoints {

    public interface IPickupPointRepository : IRepository<PickupPoint> {

        Task<IEnumerable<PickupPointListResource>> Get();
        Task<IEnumerable<PickupPointDropdownResource>> GetActiveForDropdown();
        Task<IEnumerable<PickupPoint>> GetForRoute(int routeId);
        new Task<PickupPointReadResource> GetById(int pickupPointId);
        Task<PickupPoint> GetByIdToDelete(int pickupPointId);
        void UpdateCoordinates(int pickupPointId, string coordinates);

    }

}