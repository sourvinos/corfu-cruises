using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Features.PickupPoints;

namespace BlueWaterCruises.Features.Routes {

    public interface IRouteRepository : IRepository<Route> {

        Task<IEnumerable<Route>> Get();
        Task<IEnumerable<RouteDropdownResource>> GetActiveForDropdown();
        new Task<RouteReadResource> GetById(int routeId);
        Task<Route> GetSingleToDelete(int id);

    }

}