using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Exceptions;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.PickupPoints {

    public class PickupPointRepository : Repository<PickupPoint>, IPickupPointRepository {

        private readonly IMapper mapper;

        public PickupPointRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<PickupPointListResource>> Get() {
            List<PickupPoint> pickupPoints = await context.Set<PickupPoint>()
                .Include(x => x.CoachRoute)
                .OrderBy(x => x.CoachRoute.Abbreviation).ThenBy(x => x.Time).ThenBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<PickupPoint>, IEnumerable<PickupPointListResource>>(pickupPoints);
        }

        public async Task<IEnumerable<PickupPointWithPortDropdownResource>> GetActiveWithPortForDropdown() {
            List<PickupPoint> pickupPoints = await context.Set<PickupPoint>()
                .Include(x => x.CoachRoute).ThenInclude(x => x.Port)
                .Where(x => x.IsActive)
                .OrderBy(x => x.Time).ThenBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<PickupPoint>, IEnumerable<PickupPointWithPortDropdownResource>>(pickupPoints);
        }

        public new async Task<PickupPoint> GetById(int id) {
            var record = await context.Set<PickupPoint>()
                .Include(x => x.CoachRoute)
                .SingleOrDefaultAsync(x => x.Id == id);
            if (record != null) {
                return record;
            } else {
                throw new CustomException { HttpResponseCode = 404 };
            }
        }

        public async Task<PickupPoint> GetByIdToDelete(int id) {
            return await context.Set<PickupPoint>().SingleOrDefaultAsync(x => x.Id == id);
        }

        public void UpdateCoordinates(int id, string coordinates) {
            List<PickupPoint> pickupPoints = context.Set<PickupPoint>()
                .Where(x => x.Id == id).ToList();
            pickupPoints.ForEach(x => x.Coordinates = coordinates);
            context.SaveChanges();
        }

        public int IsValid(PickupPointWriteResource record) {
            return true switch {
                var x when x == !IsValidRoute(record) => 450,
                _ => 200,
            };
        }

        private bool IsValidRoute(PickupPointWriteResource record) {
            if (record.Id == 0) {
                return context.CoachRoutes.SingleOrDefault(x => x.Id == record.RouteId && x.IsActive) != null;
            }
            return context.CoachRoutes.SingleOrDefault(x => x.Id == record.RouteId) != null;
        }

    }

}