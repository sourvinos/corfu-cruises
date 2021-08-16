using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Nationalities {

    public interface INationalityRepository : IRepository<Nationality> {

        Task<IEnumerable<NationalityDropdownResource>> GetActiveForDropdown();

    }

}