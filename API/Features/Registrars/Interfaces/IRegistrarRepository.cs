using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Registrars {

    public interface IRegistrarRepository : IRepository<Registrar> {

        Task<IEnumerable<Registrar>> Get();
        Task<IEnumerable<Registrar>> GetActiveForDropdown();
        new Task<Registrar> GetById(int RegistrarId);
        Task<Registrar> GetByIdToDelete(int RegistrarId);
        int IsValid(RegistrarWriteDto record);

    }

}