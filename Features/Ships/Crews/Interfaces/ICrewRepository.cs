using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Ships {

    public interface ICrewRepository : IRepository<Crew> {

        Task<IEnumerable<CrewListResource>> Get();
        Task<Crew> GetByIdToDelete(int id);
        new Task<CrewReadResource> GetById(int id);

    }

}