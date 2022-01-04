using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using API.Infrastructure.Middleware;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Routes {

    public class RouteRepository : Repository<Route>, IRouteRepository {

        private readonly IMapper mapper;

        public RouteRepository(AppDbContext context, IMapper mapper, IOptions<TestingEnvironment> settings) : base(context, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<RouteListResource>> Get() {
            List<Route> records = await context.Routes
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Route>, IEnumerable<RouteListResource>>(records);
        }

        public async Task<IEnumerable<RouteWithPortListResource>> GetActiveForDropdown() {
            List<Route> records = await context.Routes
                .Include(x => x.Port)
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Route>, IEnumerable<RouteWithPortListResource>>(records);
        }

        public new async Task<RouteReadResource> GetById(int id) {
            Route record = await context.Routes
                .Include(x => x.Port)
                .SingleOrDefaultAsync(m => m.Id == id);
            if (record != null) {
                return mapper.Map<Route, RouteReadResource>(record);
            } else {
                throw new RecordNotFound(ApiMessages.RecordNotFound());
            }
        }

        public async Task<Route> GetByIdToDelete(int id) {
            return await context.Routes
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}