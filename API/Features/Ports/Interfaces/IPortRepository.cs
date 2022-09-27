using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Ports {

    public interface IPortRepository : IRepository<Port> {

        Task<IEnumerable<PortListVM>> Get();
        Task<IEnumerable<PortActiveVM>> GetActive();
        Task<Port> GetById(int id, bool trackChanges);
        Task<PortWriteDto> AttachUserIdToDto(PortWriteDto port);

    }

}