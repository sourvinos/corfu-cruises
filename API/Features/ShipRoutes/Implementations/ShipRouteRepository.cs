using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.ShipRoutes {

    public class ShipRouteRepository : Repository<ShipRoute>, IShipRouteRepository {

        public ShipRouteRepository(AppDbContext appDbContext, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) { }

        public async Task<IEnumerable<ShipRoute>> Get() {
            List<ShipRoute> records = await context.ShipRoutes
                .OrderBy(x => x.FromTime)
                    .ThenBy(x => x.ViaTime)
                        .ThenBy(x => x.ToTime)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public async Task<IEnumerable<ShipRoute>> GetActiveForDropdown() {
            List<ShipRoute> records = await context.ShipRoutes
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return records;
        }

        public async Task<ShipRoute> GetByIdToDelete(int id) {
            return await context.ShipRoutes.SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}