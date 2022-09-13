using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using API.Infrastructure.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.ShipCrews {

    public class ShipCrewRepository : Repository<ShipCrew>, IShipCrewRepository {

        public ShipCrewRepository(AppDbContext appDbContext, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) { }

        public async Task<IEnumerable<ShipCrew>> Get() {
            var records = await context.ShipCrews
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(x => x.Nationality)
                .OrderBy(x => x.Ship.Description)
                    .ThenBy(x => x.Lastname)
                        .ThenBy(x => x.Firstname)
                            .ThenBy(x => x.Birthdate)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public async Task<IEnumerable<ShipCrew>> GetActiveForDropdown() {
            var records = await context.ShipCrews
                .Where(x => x.IsActive)
                .OrderBy(x => x.Lastname).ThenBy(x => x.Firstname).ThenByDescending(x => x.Birthdate)
                .AsNoTracking()
                .ToListAsync();
            return records;
        }

        public new async Task<ShipCrew> GetById(int id) {
            var record = await context.ShipCrews
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(x => x.Nationality)
                .SingleOrDefaultAsync(x => x.Id == id);
            if (record != null) {
                return record;
            } else {
                throw new CustomException { ResponseCode = 404 };
            }
        }

        public async Task<ShipCrew> GetByIdToDelete(int id) {
            var record = await context.ShipCrews.SingleOrDefaultAsync(x => x.Id == id);
            if (record != null) {
                return record;
            } else {
                throw new CustomException { ResponseCode = 404 };
            }
        }

        public int IsValid(ShipCrewWriteDto record) {
            return true switch {
                var x when x == !IsValidGender(record) => 450,
                var x when x == !IsValidNationality(record) => 451,
                var x when x == !IsValidShip(record) => 452,
                _ => 200,
            };
        }

        private bool IsValidGender(ShipCrewWriteDto record) {
            bool isValid = false;
            if (record.Id == 0) {
                isValid = context.Genders.SingleOrDefault(x => x.Id == record.GenderId && x.IsActive) != null;
            } else {
                isValid = context.Genders.SingleOrDefault(x => x.Id == record.GenderId) != null;
            }
            return isValid;
        }

        private bool IsValidNationality(ShipCrewWriteDto record) {
            bool isValid = false;
            if (record.Id == 0) {
                isValid = context.Nationalities.SingleOrDefault(x => x.Id == record.NationalityId && x.IsActive) != null;
            } else {
                isValid = context.Nationalities.SingleOrDefault(x => x.Id == record.NationalityId) != null;
            }
            return isValid;
        }

        private bool IsValidShip(ShipCrewWriteDto record) {
            bool isValid = false;
            if (record.Id == 0) {
                isValid = context.Ships.SingleOrDefault(x => x.Id == record.ShipId && x.IsActive) != null;
            } else {
                isValid = context.Ships.SingleOrDefault(x => x.Id == record.ShipId) != null;
            }
            return isValid;
        }

    }

}