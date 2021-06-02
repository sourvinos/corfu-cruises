using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class ShipRepository : Repository<Ship>, IShipRepository {

        public ShipRepository(DbContext appDbContext) : base(appDbContext) { }

        async Task<IList<Ship>> IShipRepository.Get() =>
            await context.Ships.ToListAsync();

        public new async Task<Ship> GetById(int shipId) =>
            await context.Ships.Include(x => x.ShipOwner).SingleOrDefaultAsync(m => m.Id == shipId);

    }

}