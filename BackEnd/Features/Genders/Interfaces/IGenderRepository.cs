using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Genders {

    public interface IGenderRepository : IRepository<Gender> {

        Task<IEnumerable<GenderListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        new Task<GenderReadResource> GetById(int id);
        Task<Gender> GetByIdToDelete(int id);

    }

}