using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BlueWaterCruises.Features.Drivers {

    public class DriverRepository : Repository<Driver>, IDriverRepository {

        private readonly IMapper mapper;

        public DriverRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<DriverListResource>> Get() {
            List<Driver> records = await context.Drivers
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Driver>, IEnumerable<DriverListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Driver> records = await context.Drivers
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Driver>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<DriverReadResource> GetById(int id) {
            Driver record = await context.Drivers
                .SingleOrDefaultAsync(x => x.Id == id);
            return mapper.Map<Driver, DriverReadResource>(record);
        }

        public async Task<Driver> GetByIdToDelete(int id) {
            return await context.Drivers
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}