using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Ships {

    public class RegistrarRepository : Repository<Registrar>, IRegistrarRepository {

        private readonly IMapper mapper;

        public RegistrarRepository(AppDbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        async Task<IEnumerable<RegistrarListResource>> IRegistrarRepository.Get() {
            var Registrars = await context.Set<Registrar>()
                .Include(x => x.Ship)
                .ToListAsync();
            return mapper.Map<IEnumerable<Registrar>, IEnumerable<RegistrarListResource>>(Registrars);
        }

        public new async Task<RegistrarReadResource> GetById(int registrarId) {
            var registrar = await context.Set<Registrar>()
                .Include(x => x.Ship)
                .SingleOrDefaultAsync(m => m.Id == registrarId);
            return mapper.Map<Registrar, RegistrarReadResource>(registrar);
        }

       public  async Task<Registrar> GetByIdToDelete(int registrarId) {
            var registrar = await context.Set<Registrar>()
                .SingleOrDefaultAsync(m => m.Id == registrarId);
            return registrar;
        }

    }

}