using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Destinations {

    public class DestinationRepository : Repository<Destination>, IDestinationRepository {

        private readonly IMapper mapper;

        public DestinationRepository(AppDbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<DestinationListResource>> Get() {
            var records = await context.Destinations
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Destination>, IEnumerable<DestinationListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            var records = await context.Destinations
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Destination>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<DestinationReadResource> GetById(int id) {
            var record = await context.Destinations
                .SingleOrDefaultAsync(x => x.Id == id);
            return mapper.Map<Destination, DestinationReadResource>(record);
        }

        public async Task<Destination> GetByIdToDelete(int id) {
            return await context.Destinations
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}