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

namespace API.Features.Ships {

    public class ShipRepository : Repository<Ship>, IShipRepository {

        private readonly IMapper mapper;
        private readonly IHttpContextAccessor httpContext;

        public ShipRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.httpContext = httpContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ShipListVM>> Get() {
            var ships = await context.Ships
                .AsNoTracking()
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Ship>, IEnumerable<ShipListVM>>(ships);
        }

        public async Task<IEnumerable<ShipActiveVM>> GetActive() {
            var ships = await context.Ships
                .AsNoTracking()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .ToListAsync();
            return mapper.Map<IEnumerable<Ship>, IEnumerable<ShipActiveVM>>(ships);
        }

        public async Task<Ship> GetById(int id, bool includeTables) {
            return includeTables
                ? await context.Ships
                    .AsNoTracking()
                    .Include(x => x.ShipOwner)
                    .SingleOrDefaultAsync(x => x.Id == id)
                : await context.Ships
                    .AsNoTracking()
                    .SingleOrDefaultAsync(x => x.Id == id);
        }

        public ShipWriteDto AttachUserIdToDto(ShipWriteDto ship) {
            return Identity.PatchEntityWithUserId(httpContext, ship);
        }

    }

}