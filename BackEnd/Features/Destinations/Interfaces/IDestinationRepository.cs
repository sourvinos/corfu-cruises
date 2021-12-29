using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Destinations {

    public interface IDestinationRepository : IRepository<Destination> {

        Task<IEnumerable<DestinationListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Destination> GetByIdToDelete(int id);

    }

}