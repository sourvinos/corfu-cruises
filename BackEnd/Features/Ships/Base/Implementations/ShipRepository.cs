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
            List<Ship> records = await context.Ships
                .Include(x => x.ShipOwner)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Ship>, IEnumerable<ShipListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Ship> records = await context.Ships
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Ship>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<ShipReadResource> GetById(int id) {
            Ship record = await context.Ships
                .Include(x => x.ShipOwner)
                .SingleOrDefaultAsync(x => x.Id == id);
            return mapper.Map<Ship, ShipReadResource>(record);
        }

        public async Task<Ship> GetByIdToDelete(int id) {
            return await context.Ships
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}