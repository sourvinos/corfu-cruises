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
            List<PickupPoint> pickupPoints = await context.Set<PickupPoint>()
                .Include(x => x.Route)
                .OrderBy(x => x.Route.Abbreviation)
                    .ThenBy(x => x.Time)
                        .ThenBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<PickupPoint>, IEnumerable<PickupPointListResource>>(pickupPoints);
        }

        public async Task<IEnumerable<PickupPointWithPortDropdownResource>> GetActiveWithPortForDropdown() {
            List<PickupPoint> pickupPoints = await context.Set<PickupPoint>()
                .Include(x => x.Route)
                    .ThenInclude(x => x.Port)
                .Where(x => x.IsActive)
                .OrderBy(x => x.Time)
                    .ThenBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<PickupPoint>, IEnumerable<PickupPointWithPortDropdownResource>>(pickupPoints);
        }

        public new async Task<PickupPointReadResource> GetById(int id) {
            PickupPoint pickupPoint = await context.Set<PickupPoint>()
                .Include(x => x.Route)
                .SingleOrDefaultAsync(x => x.Id == id);
            return mapper.Map<PickupPoint, PickupPointReadResource>(pickupPoint);
        }

        public async Task<PickupPoint> GetByIdToDelete(int id) {
            return await context.Set<PickupPoint>()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public void UpdateCoordinates(int id, string coordinates) {
            List<PickupPoint> pickupPoints = context.Set<PickupPoint>()
                .Where(x => x.Id == id).ToList();
            pickupPoints.ForEach(x => x.Coordinates = coordinates);
            context.SaveChanges();
        }

    }

}