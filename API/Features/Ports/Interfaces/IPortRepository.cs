using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.Ports {

    public interface IPortRepository : IRepository<Port> {

        Task<IEnumerable<PortListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Port> GetByIdToDelete(int id);

    }

}