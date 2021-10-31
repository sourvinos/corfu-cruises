using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Drivers {

    public class DriverRepository : Repository<Driver>, IDriverRepository {

        private readonly IMapper mapper;

        public DriverRepository(AppDbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<DriverListResource>> Get() {
            var records = await context.Drivers
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Driver>, IEnumerable<DriverListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            var records = await context.Drivers
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Driver>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<DriverReadResource> GetById(int id) {
            var record = await context.Drivers
                .SingleOrDefaultAsync(x => x.Id == id);
            return mapper.Map<Driver, DriverReadResource>(record);
        }

        public async Task<Driver> GetByIdToDelete(int id) {
            return await context.Drivers
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<int> GetDefault() {
            var record = await context.Drivers
                .Where(x => x.Id == 1)
                .SingleAsync();
            return record.Id;
        }

    }

}