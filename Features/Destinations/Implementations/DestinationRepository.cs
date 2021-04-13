using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class DestinationRepository : Repository<Destination>, IDestinationRepository {

        public DestinationRepository(DbContext appDbContext) : base(appDbContext) { }

        public async Task<IEnumerable<Destination>> Get() {
            return await context.Set<Destination>().ToListAsync();
        }
        
    }

}