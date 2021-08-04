using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface IShipRouteRepository : IRepository<ShipRoute> {

        Task<IEnumerable<ShipRouteListResource>> Get();
        
    }

}