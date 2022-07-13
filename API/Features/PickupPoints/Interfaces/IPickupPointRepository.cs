using System.Collections.Generic;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Interfaces;

namespace API.Features.PickupPoints {

    public interface IPickupPointRepository : IRepository<PickupPoint> {

        Task<IEnumerable<PickupPointListDto>> Get();
        Task<IEnumerable<PickupPointWithPortDropdownResource>> GetActiveWithPortForDropdown();
        new Task<PickupPoint> GetById(int pickupPointId);
        Task<PickupPoint> GetByIdToDelete(int pickupPointId);
        int IsValid(PickupPointWriteDto record);
        void UpdateCoordinates(int pickupPointId, string coordinates);

    }

}