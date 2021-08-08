using System.Collections.Generic;
using System.Threading.Tasks;
using ShipCruises.Ships;

namespace ShipCruises {

    public interface ICrewRepository : IRepository<Crew> {

        Task<IEnumerable<CrewListResource>> Get();
        Task<Crew> GetByIdToDelete(int id);
        new Task<CrewResource> GetById(int id);

    }

}