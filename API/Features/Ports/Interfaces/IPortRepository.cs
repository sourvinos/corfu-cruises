using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Ports {

    public interface IPortRepository : IRepository<Port> {

        Task<IEnumerable<Port>> Get();
        Task<IEnumerable<Port>> GetActiveForDropdown();
        Task<Port> GetByIdToDelete(int id);

    }

}