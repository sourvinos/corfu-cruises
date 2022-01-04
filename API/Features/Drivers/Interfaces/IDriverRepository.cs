using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.Drivers {

    public interface IDriverRepository : IRepository<Driver> {

        Task<IEnumerable<DriverListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Driver> GetByIdToDelete(int id);

    }

}