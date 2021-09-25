using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Ships {

    public interface IShipRouteRepository : IRepository<ShipRoute> {

        Task<IEnumerable<ShipRouteListResource>> Get();
        Task<IEnumerable<ShipRouteDropdownResource>> GetActiveForDropdown();

    }

}