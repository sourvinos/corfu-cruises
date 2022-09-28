using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Registrars {

    public interface IRegistrarRepository : IRepository<Registrar> {

        Task<IEnumerable<RegistrarListVM>> Get();
        Task<IEnumerable<RegistrarActiveVM>> GetActive();
        Task<Registrar> GetById(int id, bool includeTables);
        Task<RegistrarWriteDto> AttachUserIdToDto(RegistrarWriteDto registar);

    }

}