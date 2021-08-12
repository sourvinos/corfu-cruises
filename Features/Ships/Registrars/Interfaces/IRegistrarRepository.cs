using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises.Features.Ships {

    public interface IRegistrarRepository : IRepository<Registrar> {

        Task<IEnumerable<RegistrarListResource>> Get();
        new Task<RegistrarReadResource> GetById(int RegistrarId);
        Task<Registrar> GetByIdToDelete(int RegistrarId);

    }

}