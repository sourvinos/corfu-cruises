using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Genders {

    public interface IGenderRepository : IRepository<Gender> {

        Task<IEnumerable<GenderListVM>> Get();
        Task<IEnumerable<GenderActiveVM>> GetActive();
        Task<Gender> GetById(int id);

    }

}