using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ShipCruises {

    public class ShipRouteRepository : Repository<ShipRoute>, IShipRouteRepository {

        private readonly IMapper mapper;

        public ShipRouteRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ShipRouteListResource>> Get() {
            var shiproutes = await context.ShipRoutes
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipRoute>, IEnumerable<ShipRouteListResource>>(shiproutes);
        }


    }

}