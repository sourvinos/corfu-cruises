using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises.Features.Ships {

    public interface IShipRepository : IRepository<Ship> {

        Task<IEnumerable<ShipListResource>> Get();
        Task<Ship> GetByIdToDelete(int shipId);
        new Task<ShipReadResource> GetById(int shipId);
        
    }

}