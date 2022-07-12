using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.Destinations {

    public interface IDestinationRepository : IRepository<Destination> {

        Task<IEnumerable<DestinationListDto>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Destination> GetByIdToDelete(int id);

    }

}