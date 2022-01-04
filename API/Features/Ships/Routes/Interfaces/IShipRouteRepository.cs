using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.Ships.Routes {

    public interface IShipRouteRepository : IRepository<ShipRoute> {

        Task<IEnumerable<ShipRouteListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        // new Task<ShipRouteReadResource> GetById(int id);
        Task<ShipRoute> GetByIdToDelete(int id);

    }

}