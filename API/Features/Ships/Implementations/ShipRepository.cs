using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Ships {

    public class ShipRepository : Repository<Ship>, IShipRepository {

        private readonly IMapper mapper;

        public ShipRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<SimpleResource>> Get() {
            List<Ship> records = await context.Ships
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Ship>, IEnumerable<SimpleResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActive() {
            List<Ship> records = await context.Ships
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Ship>, IEnumerable<SimpleResource>>(records);
        }

        public async Task<Ship> GetById(int id, bool trackChanges) {
            return await FindByCondition(x => x.Id.Equals(id), trackChanges).SingleOrDefaultAsync();
        }

    }

}