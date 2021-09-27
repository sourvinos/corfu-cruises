using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlueWaterCruises.Features.Genders {

    public interface IGenderRepository : IRepository<Gender> {

        Task<IEnumerable<GenderDropdownResource>> GetActiveForDropdown();

    }

}