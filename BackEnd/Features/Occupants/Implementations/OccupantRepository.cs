using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BlueWaterCruises.Features.Occupants {

    public class OccupantRepository : Repository<Occupant>, IOccupantRepository {

        private readonly IMapper mapper;

        public OccupantRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<OccupantListResource>> Get() {
            List<Occupant> records = await context.Occupants
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Occupant>, IEnumerable<OccupantListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Occupant> records = await context.Occupants
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Occupant>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<OccupantReadResource> GetById(int id) {
            Occupant record = await context.Occupants
                .SingleOrDefaultAsync(m => m.Id == id);
            return mapper.Map<Occupant, OccupantReadResource>(record);
        }

        public async Task<Occupant> GetByIdToDelete(int id) {
            return await context.Occupants
                .SingleOrDefaultAsync(m => m.Id == id);
        }

    }

}