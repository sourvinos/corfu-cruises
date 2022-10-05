using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Drivers {

    public interface IDriverRepository : IRepository<Driver> {

        Task<IEnumerable<DriverListVM>> Get();
        Task<IEnumerable<DriverActiveVM>> GetActive();
        new Task<Driver> GetById(int id);
        DriverWriteDto AttachUserIdToDto(DriverWriteDto driver);

    }

}