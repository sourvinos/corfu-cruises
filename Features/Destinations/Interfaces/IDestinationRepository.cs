using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface IDestinationRepository : IRepository<Destination> {

        Task<IEnumerable<Destination>> Get();

    }
    
}