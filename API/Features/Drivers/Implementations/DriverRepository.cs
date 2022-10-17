using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace API.Features.Drivers {

    public class DriverRepository : Repository<Driver>, IDriverRepository {

        private readonly IMapper mapper;

        public DriverRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, ILogger<Driver> logger, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, logger, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<DriverListVM>> Get() {
            List<Driver> drivers = await context.Drivers
                .AsNoTracking()
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Driver>, IEnumerable<DriverListVM>>(drivers);
        }

        public async Task<IEnumerable<DriverActiveVM>> GetActive() {
            List<Driver> activeDrivers = await context.Drivers
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Driver>, IEnumerable<DriverActiveVM>>(activeDrivers);
        }

        public async Task<Driver> GetById(int id) {
            return await context.Drivers
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}