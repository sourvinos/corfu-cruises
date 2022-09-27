using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.PickupPoints {

    public class PickupPointRepository : Repository<PickupPoint>, IPickupPointRepository {

        private readonly IMapper mapper;
        private readonly IHttpContextAccessor httpContext;

        public PickupPointRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<PickupPointListVM>> Get() {
            List<PickupPoint> pickupPoints = await context.Set<PickupPoint>()
                .Include(x => x.CoachRoute)
                .OrderBy(x => x.CoachRoute.Abbreviation).ThenBy(x => x.Time).ThenBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<PickupPoint>, IEnumerable<PickupPointListVM>>(pickupPoints);
        }

        public async Task<IEnumerable<PickupPointWithPortVM>> GetActive() {
            List<PickupPoint> pickupPoints = await context.Set<PickupPoint>()
                .Include(x => x.CoachRoute).ThenInclude(x => x.Port)
                .Where(x => x.IsActive)
                .OrderBy(x => x.Time).ThenBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<PickupPoint>, IEnumerable<PickupPointWithPortVM>>(pickupPoints);
        }

        public async Task<PickupPoint> GetById(int id, bool includeTables) {
            return includeTables
                ? await context.Set<PickupPoint>()
                    .Include(x => x.CoachRoute)
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id)
                : await context.Set<PickupPoint>()
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<PickupPointWriteDto> AttachUserIdToRecord(PickupPointWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContext);
            record.UserId = user.UserId;
            return record;
        }

    }

}