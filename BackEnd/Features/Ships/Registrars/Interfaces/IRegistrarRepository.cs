using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Ships.Registrars {

    public interface IRegistrarRepository : IRepository<Registrar> {

        Task<IEnumerable<RegistrarListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<RegistrarReadResource> GetById(int RegistrarId);
        Task<Registrar> GetByIdToDelete(int RegistrarId);

    }

}