using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Registrars {

    public class RegistrarRepository : Repository<Registrar>, IRegistrarRepository {

        private readonly IMapper mapper;

        public RegistrarRepository(AppDbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        async Task<IEnumerable<RegistrarListResource>> IRegistrarRepository.Get() {
            List<Registrar> records = await context.Registrars
                .Include(x => x.Ship)
                .OrderBy(x => x.Ship.Description)
                    .ThenBy(x => !x.IsPrimary)
                        .ThenBy(x => x.Fullname)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Registrar>, IEnumerable<RegistrarListResource>>(records);
        }

        public new async Task<RegistrarReadResource> GetById(int id) {
            Registrar record = await context.Registrars
                .Include(x => x.Ship)
                .SingleOrDefaultAsync(x => x.Id == id);
            return mapper.Map<Registrar, RegistrarReadResource>(record);
        }

        public async Task<Registrar> GetByIdToDelete(int id) {
            return await context.Registrars
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}