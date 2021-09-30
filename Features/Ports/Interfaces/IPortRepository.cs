using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Ports {

    public interface IPortRepository : IRepository<Port> {

        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();

    }

}