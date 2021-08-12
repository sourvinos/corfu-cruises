using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises.Features.Ships {

    public interface ICrewRepository : IRepository<Crew> {

        Task<IEnumerable<CrewListResource>> Get();
        Task<Crew> GetByIdToDelete(int id);
        new Task<CrewResource> GetById(int id);

    }

}