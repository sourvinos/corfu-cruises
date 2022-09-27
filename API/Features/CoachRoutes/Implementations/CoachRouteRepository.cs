using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.CoachRoutes {

    public class CoachRouteRepository : Repository<CoachRoute>, ICoachRouteRepository {

        private readonly IMapper mapper;
        private readonly IHttpContextAccessor httpContext;

        public CoachRouteRepository(AppDbContext context, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(context, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<CoachRouteListVM>> Get() {
            List<CoachRoute> coachRoutes = await context.CoachRoutes
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<CoachRoute>, IEnumerable<CoachRouteListVM>>(coachRoutes);
        }

        public async Task<IEnumerable<CoachRouteActiveVM>> GetActive() {
            List<CoachRoute> records = await context.CoachRoutes
                .Where(x => x.IsActive)
                .OrderBy(x => x.Abbreviation)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<CoachRoute>, IEnumerable<CoachRouteActiveVM>>(records);
        }

        public async Task<CoachRoute> GetById(int id, bool includeTables) {
            return includeTables
                ? await context.CoachRoutes
                    .Include(x => x.Port)
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id)
                : await context.CoachRoutes
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<CoachRouteWriteDto> AttachUserIdToDto(CoachRouteWriteDto coachRoute) {
            var user = await Identity.GetConnectedUserId(httpContext);
            coachRoute.UserId = user.UserId;
            return coachRoute;
        }

    }

}