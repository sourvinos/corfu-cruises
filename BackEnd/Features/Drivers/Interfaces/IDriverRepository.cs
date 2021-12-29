using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Drivers {

    public interface IDriverRepository : IRepository<Driver> {

        Task<IEnumerable<DriverListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Driver> GetByIdToDelete(int id);

    }

}