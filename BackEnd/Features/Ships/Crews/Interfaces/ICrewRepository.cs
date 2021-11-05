using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Crews {

    public interface ICrewRepository : IRepository<Crew> {

        Task<IEnumerable<CrewListResource>> Get();
        new Task<CrewReadResource> GetById(int id);
        Task<Crew> GetByIdToDelete(int id);

    }

}