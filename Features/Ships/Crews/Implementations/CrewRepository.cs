
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ShipCruises {

    public class CrewRepository : Repository<Crew>, ICrewRepository {

        private readonly IMapper mapper;
        public CrewRepository(DbContext context) : base(context) { }

        public CrewRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        async Task<IEnumerable<CrewReadResource>> ICrewRepository.Get() {
            var crews = await context.Crews
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(p => p.Nationality).ToListAsync();
            return mapper.Map<IEnumerable<Crew>, IEnumerable<CrewReadResource>>(crews);
        }

        public new async Task<Crew> GetById(int crewId) {
            var crew = await context.Crews
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(p => p.Nationality).SingleOrDefaultAsync(m => m.Id == crewId);
            return crew;
        }
        
    }

}