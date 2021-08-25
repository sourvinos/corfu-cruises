using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Routes {

    public class RouteRepository : Repository<Route>, IRouteRepository {

        private readonly IMapper mapper;

        public RouteRepository(DbContext context, IMapper mapper) : base(context) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<RouteListResource>> Get() {
            var routes = await context.Routes
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Route>, IEnumerable<RouteListResource>>(routes);
        }

        public new async Task<Route> GetById(int routeId) =>
            await context.Routes.Include(p => p.Port).SingleOrDefaultAsync(m => m.Id == routeId);

    }

}