using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Features.Drivers;

namespace BlueWaterCruises.Features.Drivers {

    public interface IDriverRepository : IRepository<Driver> { 

        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<int> GetDefault();
        
    }

}