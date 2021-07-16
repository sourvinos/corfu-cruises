using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface IRouteRepository : IRepository<Route> {

        Task<IList<Route>> Get();
        new Task<Route> GetById(int routeId);

    }

}