using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Routes {

    public interface IRouteRepository : IRepository<Route> {

        Task<IEnumerable<RouteListResource>> Get();
        new Task<RouteReadResource> GetById(int routeId);
        Task<Route> GetByIdToDelete(int id);

    }

}