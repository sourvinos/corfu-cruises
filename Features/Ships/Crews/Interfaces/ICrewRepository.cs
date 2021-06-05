using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface ICrewRepository : IRepository<Crew> {

        Task<IEnumerable<CrewReadResource>> Get();
        new Task<Crew> GetById(int crewId);

    }

}