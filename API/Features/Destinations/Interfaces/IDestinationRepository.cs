using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.Destinations {

    public interface IDestinationRepository : IRepository<Destination> {

        Task<IEnumerable<DestinationListVM>> Get();
        Task<IEnumerable<SimpleResource>> GetActive();
        Task<Destination> GetById(int id, bool trackChanges);

    }

}