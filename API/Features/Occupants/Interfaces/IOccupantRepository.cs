using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.Occupants {

    public interface IOccupantRepository : IRepository<Occupant> {

        Task<IEnumerable<OccupantListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Occupant> GetByIdToDelete(int id);

    }

}