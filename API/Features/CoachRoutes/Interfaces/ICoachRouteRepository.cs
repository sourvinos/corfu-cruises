using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.CoachRoutes {

    public interface ICoachRouteRepository : IRepository<CoachRoute> {

        Task<IEnumerable<CoachRouteListDto>> Get();
        Task<IEnumerable<CoachRouteActiveForDropdownVM>> GetActiveForDropdown();
        new Task<CoachRoute> GetById(int id);
        Task<CoachRoute> GetByIdToDelete(int id);
        int IsValid(CoachRouteWriteDto record);

    }

}