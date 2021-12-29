using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Occupants {

    public interface IOccupantRepository : IRepository<Occupant> {

        Task<IEnumerable<OccupantListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Occupant> GetByIdToDelete(int id);

    }

}