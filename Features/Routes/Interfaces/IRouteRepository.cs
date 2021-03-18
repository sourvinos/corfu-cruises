using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IRouteRepository : IRepository<Route> {

        Task<IList<Route>> Get();
        new Task<Route> GetById(int routeId);

    }

}