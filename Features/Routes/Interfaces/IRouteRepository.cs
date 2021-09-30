using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Routes {

    public interface IRouteRepository : IRepository<Route> {

        Task<IEnumerable<RouteListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<RouteReadResource> GetById(int routeId);
        Task<Route> GetSingleToDelete(int id);

    }

}