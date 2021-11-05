using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Ships {

    public class ShipOwnerRepository : Repository<ShipOwner>, IShipOwnerRepository {

        private readonly IMapper mapper;

        public ShipOwnerRepository(AppDbContext context, IMapper mapper) : base(context) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ShipOwnerListResource>> Get() {
            List<ShipOwner> records = await context.ShipOwners
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipOwner>, IEnumerable<ShipOwnerListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<ShipOwner> records = await context.ShipOwners
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipOwner>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<ShipOwnerReadResource> GetById(int id) {
            ShipOwner record = await context.ShipOwners
                .SingleOrDefaultAsync(x => x.Id == id);
            return mapper.Map<ShipOwner, ShipOwnerReadResource>(record);
        }

        public async Task<ShipOwner> GetByIdToDelete(int id) {
            return await context.ShipOwners
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}