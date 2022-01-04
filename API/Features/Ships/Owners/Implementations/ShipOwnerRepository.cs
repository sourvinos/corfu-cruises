using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Ships.Owners {

    public class ShipOwnerRepository : Repository<ShipOwner>, IShipOwnerRepository {

        private readonly IMapper mapper;

        public ShipOwnerRepository(AppDbContext context, IMapper mapper, IOptions<TestingEnvironment> settings) : base(context, settings) {
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

        public async Task<ShipOwner> GetByIdToDelete(int id) {
            return await context.ShipOwners
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}