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

namespace API.Features.ShipCrews {

    public class ShipCrewRepository : Repository<ShipCrew>, IShipCrewRepository {

        private readonly IMapper mapper;

        public ShipCrewRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, ILogger<ShipCrew> logger, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, logger, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ShipCrewListVM>> Get() {
            var shipCrews = await context.ShipCrews
                .AsNoTracking()
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(x => x.Nationality)
                .OrderBy(x => x.Ship.Description).ThenBy(x => x.Lastname).ThenBy(x => x.Firstname).ThenBy(x => x.Birthdate)
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipCrew>, IEnumerable<ShipCrewListVM>>(shipCrews);
        }

        public async Task<IEnumerable<ShipCrewActiveVM>> GetActive() {
            var shipCrews = await context.ShipCrews
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Lastname).ThenBy(x => x.Firstname).ThenByDescending(x => x.Birthdate)
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipCrew>, IEnumerable<ShipCrewActiveVM>>(shipCrews);
        }

        public async Task<ShipCrew> GetById(int id, bool includeTables) {
            return includeTables
                ? await context.ShipCrews
                    .AsNoTracking()
                    .Include(x => x.Ship)
                    .Include(x => x.Gender)
                    .Include(x => x.Nationality)
                    .SingleOrDefaultAsync(x => x.Id == id)
                : await context.ShipCrews
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}