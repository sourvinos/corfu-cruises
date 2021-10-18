using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Ships {

    public class ShipRepository : Repository<Ship>, IShipRepository {

        private readonly IMapper mapper;

        public ShipRepository(AppDbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ShipListResource>> Get() {
            var ships = await context.Set<Ship>()
                .Include(x => x.ShipOwner)
                .Where(x => x.Id > 1)
                .ToListAsync();
            return mapper.Map<IEnumerable<Ship>, IEnumerable<ShipListResource>>(ships);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            var records = await context.Set<Ship>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Ship>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<ShipReadResource> GetById(int shipId) {
            var ship = await context.Set<Ship>()
                .Include(x => x.ShipOwner)
                .SingleOrDefaultAsync(m => m.Id == shipId);
            return mapper.Map<Ship, ShipReadResource>(ship);
        }

        public async Task<Ship> GetByIdToDelete(int shipId) {
            return await context.Set<Ship>()
                .SingleOrDefaultAsync(m => m.Id == shipId);
        }

    }

}