using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.ShipOwners {

    public class ShipOwnerRepository : Repository<ShipOwner>, IShipOwnerRepository {

        public ShipOwnerRepository(AppDbContext context, IOptions<TestingEnvironment> settings) : base(context, settings) { }

        public async Task<IEnumerable<ShipOwner>> Get() {
            List<ShipOwner> records = await context.ShipOwners
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public async Task<IEnumerable<ShipOwner>> GetActiveForDropdown() {
            List<ShipOwner> records = await context.ShipOwners
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public async Task<ShipOwner> GetByIdToDelete(int id) {
            return await context.ShipOwners.SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}