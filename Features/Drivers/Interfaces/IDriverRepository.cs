using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface IDriverRepository : IRepository<Driver> { 

        Task<IEnumerable<DriverDropdownResource>> GetActiveForDropdown();
        
    }

}