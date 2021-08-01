using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface ICrewRepository : IRepository<Crew> {

        Task<IEnumerable<CrewListResource>> Get();
        new Task<Crew> GetById(int crewId);

    }

}