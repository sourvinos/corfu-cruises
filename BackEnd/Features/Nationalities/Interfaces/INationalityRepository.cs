using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Nationalities {

    public interface INationalityRepository : IRepository<Nationality> {

        Task<IEnumerable<NationalityListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<NationalityReadResource> GetById(int id);
        Task<Nationality> GetByIdToDelete(int id);

    }

}