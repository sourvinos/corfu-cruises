using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Ports {

    public interface IPortRepository : IRepository<Port> {

        Task<IEnumerable<PortListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<PortReadResource> GetById(int id);
        Task<Port> GetByIdToDelete(int id);


    }

}