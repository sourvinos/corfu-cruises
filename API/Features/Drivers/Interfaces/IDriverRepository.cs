using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Drivers {

    public interface IDriverRepository : IRepository<Driver> {

        Task<IEnumerable<DriverListVM>> Get();
        Task<IEnumerable<DriverActiveVM>> GetActive();
        Task<Driver> GetById(int id, bool trackChanges);
        Task<DriverWriteDto> AttachUserIdToDto(DriverWriteDto port);

    }

}