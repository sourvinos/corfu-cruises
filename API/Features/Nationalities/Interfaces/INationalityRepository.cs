using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Interfaces;

namespace API.Features.Nationalities {

    public interface INationalityRepository : IRepository<Nationality> {

        Task<IEnumerable<NationalityListVM>> Get();
        Task<IEnumerable<NationalityActiveVM>> GetActive();
        new Task<Nationality> GetById(int id);
        Task<NationalityWriteDto> AttachUserIdToDto(NationalityWriteDto nationality);

    }

}