using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Nationalities {

    public interface INationalityRepository : IRepository<Nationality> {

        Task<IEnumerable<NationalityListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Nationality> GetByIdToDelete(int id);

    }

}