using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;

namespace API.Features.Genders {

    public interface IGenderRepository : IRepository<Gender> {

        Task<IEnumerable<GenderListResource>> Get();
        Task<IEnumerable<SimpleResource>> GetActiveForDropdown();
        Task<Gender> GetByIdToDelete(int id);

    }

}