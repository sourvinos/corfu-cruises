using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Ships.Crews {

    public interface ICrewRepository : IRepository<Crew> {

        Task<IEnumerable<CrewListResource>> Get();
        new Task<CrewReadResource> GetById(int id);
        Task<Crew> GetByIdToDelete(int id);

    }

}