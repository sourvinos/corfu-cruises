using System.Collections.Generic;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Interfaces;

namespace API.Features.PickupPoints {

    public interface IPickupPointRepository : IRepository<PickupPoint> {

        Task<IEnumerable<PickupPointListVM>> Get();
        Task<IEnumerable<PickupPointWithPortVM>> GetActive();
        Task<PickupPoint> GetById(int id, bool includeTables);
        Task<PickupPointWriteDto> AttachUserIdToRecord(PickupPointWriteDto record);

    }

}