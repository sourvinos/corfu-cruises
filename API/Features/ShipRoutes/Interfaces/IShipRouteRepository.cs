using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipRoutes {

    public interface IShipRouteRepository : IRepository<ShipRoute> {

        Task<IEnumerable<ShipRoute>> Get();
        Task<IEnumerable<ShipRoute>> GetActiveForDropdown();
        Task<ShipRoute> GetByIdToDelete(int id);

    }

}