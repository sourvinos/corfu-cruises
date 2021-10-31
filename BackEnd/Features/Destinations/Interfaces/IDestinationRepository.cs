using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Destinations {

    public interface IDestinationRepository : IRepository<Destination> {

        Task<IEnumerable<DestinationListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<DestinationReadResource> GetById(int id);
        Task<Destination> GetByIdToDelete(int id);

    }

}