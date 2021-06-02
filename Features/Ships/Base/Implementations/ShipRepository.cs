using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class ShipRepository : Repository<Ship>, IShipRepository {

        private readonly IMapper mapper;

        public ShipRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        async Task<IList<Ship>> IShipRepository.Get() =>
            await context.Ships.ToListAsync();

        public new async Task<ShipReadResource> GetById(int shipId) {
            var ship = await context.Ships.Include(x => x.ShipOwner).SingleOrDefaultAsync(m => m.Id == shipId);
            return mapper.Map<Ship, ShipReadResource>(ship);
        }

        public async Task<Ship> GetByIdToDelete(int shipId) {
            return await context.Ships.SingleOrDefaultAsync(m => m.Id == shipId);
        }

    }

}