using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipRoutes {

    public interface IShipRouteRepository : IRepository<ShipRoute> {

        Task<IEnumerable<ShipRouteListVM>> Get();
        Task<IEnumerable<ShipRouteActiveVM>> GetActive();
        Task<ShipRoute> GetById(int id);
        ShipRouteWriteDto AttachUserIdToDto(ShipRouteWriteDto shipRoute);

    }

}