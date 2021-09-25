using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Ports {

    public class PortRepository : Repository<Port>, IPortRepository {

        private readonly IMapper mapper;

        public PortRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<PortDropdownResource>> GetActiveForDropdown() {
            var records = await context
                .Set<Port>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Port>, IEnumerable<PortDropdownResource>>(records);
        }

    }

}