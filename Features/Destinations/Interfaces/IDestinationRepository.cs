using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IDestinationRepository : IRepository<Destination> {

        Task<IEnumerable<Destination>> Get();

    }
    
}