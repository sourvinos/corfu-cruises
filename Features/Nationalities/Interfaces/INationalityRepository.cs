using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface INationalityRepository : IRepository<Nationality> {

        Task<IEnumerable<NationalityDropdownResource>> GetActiveForDropdown();

    }

}