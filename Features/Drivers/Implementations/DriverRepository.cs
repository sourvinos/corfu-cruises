using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Drivers {

    public class DriverRepository : Repository<Driver>, IDriverRepository {

        private readonly IMapper mapper;

        public DriverRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            var records = await context
                .Set<Driver>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Driver>, IEnumerable<SimpleResource>>(records);
        }

        public async Task<int> GetDefault() {
            var record = await context.Drivers.Where(x => x.Id == 1).SingleAsync();
            return record.Id;
        }

    }

}