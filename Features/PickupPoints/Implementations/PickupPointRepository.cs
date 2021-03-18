using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class PickupPointRepository : Repository<PickupPoint>, IPickupPointRepository {

        public PickupPointRepository(DbContext appDbContext) : base(appDbContext) { }

        public async Task<IEnumerable<PickupPoint>> Get() =>
            await context.PickupPoints.Include(x => x.Route).ThenInclude(y => y.Port).OrderBy(o => o.Time).ThenBy(o => o.Description).AsNoTracking().ToListAsync();

        public async Task<IEnumerable<PickupPoint>> GetActive() =>
            await context.PickupPoints.Include(x => x.Route).ThenInclude(y => y.Port).Where(a => a.IsActive).OrderBy(o => o.Time).ThenBy(o => o.Description).AsNoTracking().ToListAsync();

        public async Task<IEnumerable<PickupPoint>> GetForRoute(int routeId) =>
            await context.PickupPoints.Include(x => x.Route).ThenInclude(y => y.Port).Where(m => m.RouteId == routeId).OrderBy(o => o.Time).ThenBy(o => o.Description).AsNoTracking().ToListAsync();

        public new async Task<PickupPoint> GetById(int pickupPointId) =>
            await context.PickupPoints.Include(x => x.Route).ThenInclude(y => y.Port).SingleOrDefaultAsync(m => m.Id == pickupPointId);

        public void UpdateCoordinates(int pickupPointId, string coordinates) {
            var pickupPoints = context.PickupPoints.Where(x => x.Id == pickupPointId).ToList();
            pickupPoints.ForEach(a => a.Coordinates = coordinates);
            context.SaveChanges();
        }

    }

}