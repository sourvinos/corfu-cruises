using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IShipRepository : IRepository<Ship> {

        Task<IList<Ship>> Get();
        new Task<Ship> GetById(int shipId);
        
    }

}