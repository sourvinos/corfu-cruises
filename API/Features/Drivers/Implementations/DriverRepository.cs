using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Drivers {

    public class DriverRepository : Repository<Driver>, IDriverRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        public DriverRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<DriverListVM>> Get() {
            List<Driver> drivers = await context.Drivers
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Driver>, IEnumerable<DriverListVM>>(drivers);
        }

        public async Task<IEnumerable<DriverActiveVM>> GetActive() {
            List<Driver> activeDrivers = await context.Drivers
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Driver>, IEnumerable<DriverActiveVM>>(activeDrivers);
        }

        public async Task<Driver> GetById(int id, bool includeTables) {
            return await context.Drivers.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<DriverWriteDto> AttachUserIdToDto(DriverWriteDto driver) {
            var user = await Identity.GetConnectedUserId(httpContext);
            driver.UserId = user.UserId;
            return driver;
        }

    }

}