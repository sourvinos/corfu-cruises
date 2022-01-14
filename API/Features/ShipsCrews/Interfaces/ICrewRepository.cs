using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.ShipsCrews {

    public interface ICrewRepository : IRepository<Crew> {

        Task<IEnumerable<CrewListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<CrewReadResource> GetById(int id);
        Task<Crew> GetByIdToDelete(int id);
        int IsValid(CrewWriteResource record);

    }

}