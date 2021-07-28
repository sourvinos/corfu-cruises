using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ShipCruises.PickupPoints;

namespace ShipCruises.PickupPoints {

    public class PickupPointRepository : Repository<PickupPoint>, IPickupPointRepository {

        private readonly IMapper mapper;

        public PickupPointRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<PickupPointResource>> Get() {
            var pickupPoints = await context.PickupPoints.Include(x => x.Route).ThenInclude(y => y.Port).OrderBy(o => o.Time).ThenBy(o => o.Description).AsNoTracking().ToListAsync();
            return mapper.Map<IEnumerable<PickupPoint>, IEnumerable<PickupPointResource>>(pickupPoints);
        }

        public async Task<IEnumerable<PickupPoint>> GetActive() =>
            await context.PickupPoints.Include(x => x.Route).ThenInclude(y => y.Port).Where(a => a.IsActive).OrderBy(o => o.Time).ThenBy(o => o.Description).AsNoTracking().ToListAsync();

        public async Task<IEnumerable<PickupPoint>> GetForRoute(int routeId) =>
            await context.PickupPoints.Include(x => x.Route).ThenInclude(y => y.Port).Where(m => m.RouteId == routeId).OrderBy(o => o.Time).ThenBy(o => o.Description).AsNoTracking().ToListAsync();

        public new async Task<PickupPoint> GetById(int pickupPointId) =>
            await context.PickupPoints.Include(x => x.Route).ThenInclude(y => y.Port).SingleOrDefaultAsync(m => m.Id == pickupPointId);

        public int GetPortId(int pickupPointId) {
            return context.PickupPoints.Include(x => x.Route).FirstOrDefault(x => x.Id == pickupPointId).Route.PortId;
        }

        public void UpdateCoordinates(int pickupPointId, string coordinates) {
            var pickupPoints = context.PickupPoints.Where(x => x.Id == pickupPointId).ToList();
            pickupPoints.ForEach(a => a.Coordinates = coordinates);
            context.SaveChanges();
        }

    }

}