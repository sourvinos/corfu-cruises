using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using API.Infrastructure.Middleware;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Ships.Base {

    public class ShipRepository : Repository<Ship>, IShipRepository {

        private readonly IMapper mapper;

        public ShipRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ShipListResource>> Get() {
            List<Ship> records = await context.Ships
                .Include(x => x.ShipOwner)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Ship>, IEnumerable<ShipListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Ship> records = await context.Ships
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Ship>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<Ship> GetById(int id) {
            var record = await context.Ships
                .Include(x => x.ShipOwner)
                .SingleOrDefaultAsync(x => x.Id == id);
            if (record != null) {
                return record;
            } else {
                throw new RecordNotFound(ApiMessages.RecordNotFound());
            }
        }

        public async Task<Ship> GetByIdToDelete(int id) {
            return await context.Ships
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public int IsValid(ShipWriteResource record) {
            return true switch {
                var x when x == !IsValidShipOwner(record) => 450,
                _ => 200,
            };
        }

        private bool IsValidShipOwner(ShipWriteResource record) {
            return context.ShipOwners.SingleOrDefault(x => x.Id == record.ShipOwnerId && x.IsActive) != null;
        }

    }

}