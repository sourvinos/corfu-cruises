using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Ports {

    public interface IPortRepository : IRepository<Port> {

        Task<IEnumerable<PortListVM>> Get();
        Task<IEnumerable<PortActiveVM>> GetActive();
        new Task<Port> GetById(int id);
        PortWriteDto AttachUserIdToDto(PortWriteDto port);

    }

}