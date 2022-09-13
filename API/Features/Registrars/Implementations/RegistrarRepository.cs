using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using API.Infrastructure.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Registrars {

    public class RegistrarRepository : Repository<Registrar>, IRegistrarRepository {

        public RegistrarRepository(AppDbContext appDbContext, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) { }

        async Task<IEnumerable<Registrar>> IRegistrarRepository.Get() {
            var records = await context.Registrars
                .Include(x => x.Ship)
                .OrderBy(x => x.Ship.Description).ThenBy(x => !x.IsPrimary).ThenBy(x => x.Fullname)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public async Task<IEnumerable<Registrar>> GetActiveForDropdown() {
            var records = await context.Registrars
                .Where(x => x.IsActive)
                .OrderBy(x => x.Fullname)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public new async Task<Registrar> GetById(int id) {
            var record = await context.Registrars
                .Include(x => x.Ship)
                .SingleOrDefaultAsync(m => m.Id == id);
            if (record != null) {
                return record;
            } else {
                throw new CustomException { ResponseCode = 404 };
            }
        }

        public async Task<Registrar> GetByIdToDelete(int id) {
            return await context.Registrars.SingleOrDefaultAsync(x => x.Id == id);
        }

        public int IsValid(RegistrarWriteDto record) {
            return true switch {
                var x when x == !IsValidShip(record) => 450,
                _ => 200,
            };
        }

        private bool IsValidShip(RegistrarWriteDto record) {
            if (record.Id == 0) {
                return context.Ships.SingleOrDefault(x => x.Id == record.ShipId && x.IsActive) != null;
            }
            return context.Ships.SingleOrDefault(x => x.Id == record.ShipId) != null;
        }

    }

}