using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Destinations {

    public interface IDestinationRepository : IRepository<Destination> {

        Task<IEnumerable<DestinationDropdownResource>> GetActiveForDropdown();

    }

}