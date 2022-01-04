using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Destinations {

    public class DestinationRepository : Repository<Destination>, IDestinationRepository {

        private readonly IMapper mapper;

        public DestinationRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<DestinationListResource>> Get() {
            List<Destination> records = await context.Destinations
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Destination>, IEnumerable<DestinationListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Destination> records = await context.Destinations
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Destination>, IEnumerable<SimpleResource>>(records);
        }

        public async Task<Destination> GetByIdToDelete(int id) {
            return await context.Destinations
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}