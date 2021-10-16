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

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            var records = await context.Set<ShipOwner>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipOwner>, IEnumerable<SimpleResource>>(records);
        }

    }

}