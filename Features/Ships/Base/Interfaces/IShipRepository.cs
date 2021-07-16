using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface IShipRepository : IRepository<Ship> {

        Task<IList<Ship>> Get();
        Task<Ship> GetByIdToDelete(int shipId);
        new Task<ShipReadResource> GetById(int shipId);
        
    }

}