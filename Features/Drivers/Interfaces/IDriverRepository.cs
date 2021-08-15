using System.Collections.Generic;
using System.Threading.Tasks;
using ShipCruises.Features.Drivers;

namespace ShipCruises {

    public interface IDriverRepository : IRepository<Driver> { 

        Task<IEnumerable<DriverDropdownResource>> GetActiveForDropdown();
        Task<int> GetDefault();
        
    }

}