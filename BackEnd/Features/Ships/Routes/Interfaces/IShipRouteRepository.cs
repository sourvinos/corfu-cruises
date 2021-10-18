using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.ShipRoutes {

    public interface IShipRouteRepository : IRepository<ShipRoute> {

        Task<IEnumerable<ShipRouteListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();

    }

}