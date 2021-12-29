using System.Collections.Generic;
using System.Threading.Tasks;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Interfaces;

namespace BlueWaterCruises.Features.Genders {

    public interface IGenderRepository : IRepository<Gender> {

        Task<IEnumerable<GenderListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Gender> GetByIdToDelete(int id);

    }

}