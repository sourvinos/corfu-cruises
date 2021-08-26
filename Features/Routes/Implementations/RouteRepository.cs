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

        public new async Task<RouteReadResource> GetById(int routeId) {
            var route = await context.Routes
                .Include(x => x.Port)
                .SingleOrDefaultAsync(m => m.Id == routeId);
            return mapper.Map<Route, RouteReadResource>(route);
        }

        public async Task<Route> GetSingleToDelete(int id) {
            var route = await context.Routes
                .Include(x => x.Port)
                .FirstAsync(x => x.Id == id);
            return route;
        }
   
    }

}