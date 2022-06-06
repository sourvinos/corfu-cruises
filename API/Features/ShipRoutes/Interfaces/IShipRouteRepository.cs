using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipRoutes {

    public interface IShipRouteRepository : IRepository<ShipRoute> {

        Task<IEnumerable<ShipRouteListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<ShipRoute> GetByIdToDelete(int id);

    }

}