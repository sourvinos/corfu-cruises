using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Destinations {

    public interface IDestinationRepository : IRepository<Destination> {

        Task<IEnumerable<DestinationListVM>> Get();
        Task<IEnumerable<DestinationActiveVM>> GetActive();
        Task<Destination> GetById(int id);
        DestinationWriteDto AttachUserIdToDto(DestinationWriteDto destination);

    }

}