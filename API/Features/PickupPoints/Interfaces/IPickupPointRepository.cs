using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.PickupPoints {

    public interface IPickupPointRepository : IRepository<PickupPoint> {

        Task<IEnumerable<PickupPointListVM>> Get();
        Task<IEnumerable<PickupPointActiveVM>> GetActive();
        Task<PickupPoint> GetById(int id, bool includeTables);
        PickupPointWriteDto AttachUserIdToDto(PickupPointWriteDto pickupPoint);

    }

}