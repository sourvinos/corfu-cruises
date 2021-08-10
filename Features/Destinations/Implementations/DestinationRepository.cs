using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ShipCruises {

    public class DestinationRepository : Repository<Destination>, IDestinationRepository {

        private readonly IMapper mapper;

        public DestinationRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<DestinationDropdownResource>> GetActiveForDropdown() {
            var records = await context
                .Set<Destination>()
                .Where(x => x.IsActive)
                .ToListAsync();
            return mapper.Map<IEnumerable<Destination>, IEnumerable<DestinationDropdownResource>>(records);
        }
        
    }

}