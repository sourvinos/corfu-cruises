using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Genders {

    public interface IGenderRepository : IRepository<Gender> {

        Task<IEnumerable<GenderListVM>> Get();
        Task<IEnumerable<GenderActiveVM>> GetActive();
        new Task<Gender> GetById(int id);
        GenderWriteDto AttachUserIdToDto(GenderWriteDto gender);

    }

}