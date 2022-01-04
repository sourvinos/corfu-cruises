using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Ships.Crews {

    public interface ICrewRepository : IRepository<Crew> {

        Task<IEnumerable<CrewListResource>> Get();
        new Task<CrewReadResource> GetById(int id);
        Task<Crew> GetByIdToDelete(int id);

    }

}