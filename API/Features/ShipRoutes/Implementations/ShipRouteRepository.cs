using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.ShipRoutes {

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

        public async Task<ShipRoute> GetByIdToDelete(int id) {
            return await context.ShipRoutes.SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}