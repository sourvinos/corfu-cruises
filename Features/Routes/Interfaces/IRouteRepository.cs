using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Routes {

    public interface IRouteRepository : IRepository<Route> {

        Task<IList<Route>> Get();
        new Task<Route> GetById(int routeId);

    }

}