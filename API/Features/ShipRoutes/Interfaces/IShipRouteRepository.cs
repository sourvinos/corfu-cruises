using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipRoutes {

    public interface IShipRouteRepository : IRepository<ShipRoute> {

        Task<IEnumerable<ShipRouteListVM>> Get();
        Task<IEnumerable<ShipRouteActiveVM>> GetActive();
        new Task<ShipRoute> GetById(int id);
        Task<ShipRouteWriteDto> AttachUserIdToDto(ShipRouteWriteDto shipRoute);

    }

}