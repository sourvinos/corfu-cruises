using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Features.Reservations;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointRepository : Repository<PickupPoint>, IPickupPointRepository {

        private readonly IMapper mapper;

        public PickupPointRepository(AppDbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<PickupPointListResource>> Get() {
            var pickupPoints = await context.Set<PickupPoint>()
                .Include(x => x.Route)
                .OrderBy(o => o.Route.Abbreviation)
                    .ThenBy(o => o.Time)
                        .ThenBy(o => o.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<PickupPoint>, IEnumerable<PickupPointListResource>>(pickupPoints);
        }

        public async Task<IEnumerable<PickupPointWithPortDropdownResource>> GetActiveWithPortForDropdown() {
            var pickupPoints = await context.Set<PickupPoint>()
                .Include(x => x.Route)
                    .ThenInclude(y => y.Port)
                .Where(x => x.IsActive)
                .OrderBy(x => x.Time)
                    .ThenBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<PickupPoint>, IEnumerable<PickupPointWithPortDropdownResource>>(pickupPoints);
        }

        public new async Task<PickupPointReadResource> GetById(int pickupPointId) {
            var pickupPoint = await context.Set<PickupPoint>()
                .Include(x => x.Route)
                .SingleOrDefaultAsync(m => m.Id == pickupPointId);
            return mapper.Map<PickupPoint, PickupPointReadResource>(pickupPoint);
        }

        public async Task<PickupPoint> GetByIdToDelete(int pickupPointId) {
            return await context.Set<PickupPoint>()
                .SingleOrDefaultAsync(m => m.Id == pickupPointId);
        }

        public void UpdateCoordinates(int pickupPointId, string coordinates) {
            var pickupPoints = context.Set<PickupPoint>()
                .Where(x => x.Id == pickupPointId).ToList();
            pickupPoints.ForEach(a => a.Coordinates = coordinates);
            context.SaveChanges();
        }

    }

}