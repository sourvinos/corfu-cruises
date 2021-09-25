using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Ships {

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

         public async Task<IEnumerable<ShipRouteDropdownResource>> GetActiveForDropdown() {
            var records = await context
                .Set<ShipRoute>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipRoute>, IEnumerable<ShipRouteDropdownResource>>(records);
        }

    }

}