using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Ships {

    public class CrewRepository : Repository<Crew>, ICrewRepository {

        private readonly IMapper mapper;
        public CrewRepository(DbContext context) : base(context) { }

        public CrewRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<CrewListResource>> Get() {
            var crews = await context.Crews
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(p => p.Nationality)
                .OrderBy(x => x.Ship.Description)
                    .ThenBy(x => x.Lastname)
                        .ThenBy(x => x.Firstname)
                            .ThenBy(x => x.Birthdate)
                .ToListAsync();
            return mapper.Map<IEnumerable<Crew>, IEnumerable<CrewListResource>>(crews);
        }

        public new async Task<CrewReadResource> GetById(int crewId) {
            var crew = await context.Crews
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(p => p.Nationality)
                .SingleOrDefaultAsync(m => m.Id == crewId);
            return mapper.Map<Crew, CrewReadResource>(crew);
        }

        public async Task<Crew> GetByIdToDelete(int id) {
            return await context.Crews.SingleOrDefaultAsync(m => m.Id == id);
        }

    }

}