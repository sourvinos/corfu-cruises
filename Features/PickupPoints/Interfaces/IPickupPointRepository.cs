using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Features.Reservations;

namespace BlueWaterCruises.Features.PickupPoints {

    public interface IPickupPointRepository : IRepository<PickupPoint> {

        Task<IEnumerable<PickupPointListResource>> Get();
        Task<IEnumerable<PickupPointWithPortDropdownResource>> GetActiveWithPortForDropdown();
        new Task<PickupPointReadResource> GetById(int pickupPointId);
        Task<PickupPoint> GetByIdToDelete(int pickupPointId);
        void UpdateCoordinates(int pickupPointId, string coordinates);

    }

}