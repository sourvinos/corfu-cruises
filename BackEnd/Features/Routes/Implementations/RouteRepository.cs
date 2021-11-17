using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Routes {

    public class RouteRepository : Repository<Route>, IRouteRepository {

        private readonly IMapper mapper;

        public RouteRepository(AppDbContext context, IMapper mapper) : base(context) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<RouteListResource>> Get() {
            List<Route> records = await context.Routes
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Route>, IEnumerable<RouteListResource>>(records);
        }

        public new async Task<RouteReadResource> GetById(int id) {
            Route record = await context.Routes
                .Include(x => x.Port)
                .SingleOrDefaultAsync(m => m.Id == id);
            return mapper.Map<Route, RouteReadResource>(record);
        }

        public async Task<Route> GetByIdToDelete(int id) {
            return await context.Routes
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}