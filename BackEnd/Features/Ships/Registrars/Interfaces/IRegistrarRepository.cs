using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Ships.Registrars {

    public interface IRegistrarRepository : IRepository<Registrar> {

        Task<IEnumerable<RegistrarListResource>> Get();
        new Task<RegistrarReadResource> GetById(int RegistrarId);
        Task<Registrar> GetByIdToDelete(int RegistrarId);

    }

}