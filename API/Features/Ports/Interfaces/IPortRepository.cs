using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Ports {

    public interface IPortRepository : IRepository<Port> {

        Task<IEnumerable<PortListVM>> Get();
        Task<IEnumerable<Port>> GetActiveForDropdown();
        Task<Port> GetPort(int id, bool trackChanges);
        Task<Port> GetByIdToDelete(int id);

    }

}