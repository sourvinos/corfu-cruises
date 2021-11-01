using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Occupants {

    public interface IOccupantRepository : IRepository<Occupant> {

        Task<IEnumerable<OccupantListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<OccupantReadResource> GetById(int id);
        Task<Occupant> GetByIdToDelete(int id);

    }

}