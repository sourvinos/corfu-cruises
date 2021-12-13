using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BlueWaterCruises.Features.Ships.ShipRoutes {

    public class ShipRouteRepository : Repository<ShipRoute>, IShipRouteRepository {

        private readonly IMapper mapper;

        public ShipRouteRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ShipRouteListResource>> Get() {
            List<ShipRoute> records = await context.ShipRoutes
                .OrderBy(x => x.FromTime)
                    .ThenBy(x => x.ViaTime)
                        .ThenBy(x => x.ToTime)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipRoute>, IEnumerable<ShipRouteListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<ShipRoute> records = await context.ShipRoutes
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipRoute>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<ShipRouteReadResource> GetById(int id) {
            ShipRoute record = await context.ShipRoutes
                .SingleOrDefaultAsync(x => x.Id == id);
            return mapper.Map<ShipRoute, ShipRouteReadResource>(record);
        }

        public async Task<ShipRoute> GetByIdToDelete(int id) {
            return await context.ShipRoutes
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}