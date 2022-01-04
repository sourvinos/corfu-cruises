using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Routes {

    public interface IRouteRepository : IRepository<Route> {

        Task<IEnumerable<RouteListResource>> Get();
        Task<IEnumerable<RouteWithPortListResource>> GetActiveForDropdown();
        new Task<RouteReadResource> GetById(int routeId);
        Task<Route> GetByIdToDelete(int id);

    }

}