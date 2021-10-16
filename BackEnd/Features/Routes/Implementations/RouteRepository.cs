using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Features.PickupPoints;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Routes {

    public class RouteRepository : Repository<Route>, IRouteRepository {

        private readonly IMapper mapper;

        public RouteRepository(AppDbContext context, IMapper mapper) : base(context) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<Route>> Get() {
            var routes = await context.Set<Route>()
                .AsNoTracking()
                .ToListAsync();
            return routes;
            // return mapper.Map<IEnumerable<Route>, IEnumerable<RouteListResource>>(routes);
        }

        public async Task<IEnumerable<RouteDropdownResource>> GetActiveForDropdown() {
            var records = await context.Set<Route>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Abbreviation)
                .ToListAsync();
            return mapper.Map<IEnumerable<Route>, IEnumerable<RouteDropdownResource>>(records);
        }

        public new async Task<RouteReadResource> GetById(int routeId) {
            var route = await context.Set<Route>()
                .Include(x => x.Port)
                .SingleOrDefaultAsync(m => m.Id == routeId);
            return mapper.Map<Route, RouteReadResource>(route);
        }

        public async Task<Route> GetSingleToDelete(int id) {
            var route = await context.Set<Route>()
                .Include(x => x.Port)
                .FirstAsync(x => x.Id == id);
            return route;
        }
   
    }

}