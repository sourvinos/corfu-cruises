using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using API.Infrastructure.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Ships {

    public class ShipRepository : Repository<Ship>, IShipRepository {

        public ShipRepository(AppDbContext appDbContext, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) { }

        public async Task<IEnumerable<Ship>> Get() {
            List<Ship> records = await context.Ships
                .Include(x => x.ShipOwner)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public async Task<IEnumerable<Ship>> GetActiveForDropdown() {
            List<Ship> records = await context.Ships
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public new async Task<Ship> GetById(int id) {
            var record = await context.Ships
                .Include(x => x.ShipOwner)
                .SingleOrDefaultAsync(x => x.Id == id);
            if (record != null) {
                return record;
            } else {
                throw new CustomException { HttpResponseCode = 404 };
            }
        }

        public async Task<Ship> GetByIdToDelete(int id) {
            return await context.Ships.SingleOrDefaultAsync(x => x.Id == id);
        }

        public int IsValid(ShipWriteDto record) {
            return true switch {
                var x when x == !IsValidShipOwner(record) => 450,
                _ => 200,
            };
        }

        private bool IsValidShipOwner(ShipWriteDto record) {
           bool isValid = false;
            if (record.Id == 0) {
                isValid = context.ShipOwners.SingleOrDefault(x => x.Id == record.ShipOwnerId && x.IsActive) != null;
            } else {
                isValid = context.ShipOwners.SingleOrDefault(x => x.Id == record.ShipOwnerId) != null;
            }
            return isValid;
        }

    }

}