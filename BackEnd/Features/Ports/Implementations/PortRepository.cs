using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Ports {

    public class PortRepository : Repository<Port>, IPortRepository {

        private readonly IMapper mapper;

        public PortRepository(AppDbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<PortListResource>> Get() {
            List<Port> records = await context.Ports
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Port>, IEnumerable<PortListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Port> records = await context.Set<Port>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Port>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<PortReadResource> GetById(int id) {
            Port record = await context.Ports
                .SingleOrDefaultAsync(m => m.Id == id);
            return mapper.Map<Port, PortReadResource>(record);
        }

        public async Task<Port> GetByIdToDelete(int id) {
            return await context.Ports
                .SingleOrDefaultAsync(m => m.Id == id);
        }

    }

}