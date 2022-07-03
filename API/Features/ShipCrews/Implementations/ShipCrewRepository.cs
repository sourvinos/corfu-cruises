using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using API.Infrastructure.Exceptions;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.ShipCrews {

    public class ShipCrewRepository : Repository<ShipCrew>, IShipCrewRepository {

        private readonly IMapper mapper;

        public ShipCrewRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ShipCrewListResource>> Get() {
            List<ShipCrew> records = await context.ShipCrews
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(x => x.Nationality)
                .OrderBy(x => x.Ship.Description)
                    .ThenBy(x => x.Lastname)
                        .ThenBy(x => x.Firstname)
                            .ThenBy(x => x.Birthdate)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipCrew>, IEnumerable<ShipCrewListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<ShipCrew> records = await context.ShipCrews
                .Where(x => x.IsActive)
                .OrderBy(x => x.Lastname).ThenBy(x => x.Firstname).ThenByDescending(x => x.Birthdate)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<ShipCrew>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<ShipCrewReadResource> GetById(int id) {
            ShipCrew record = await context.ShipCrews
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(x => x.Nationality)
                .SingleOrDefaultAsync(x => x.Id == id);
            if (record != null) {
                return mapper.Map<ShipCrew, ShipCrewReadResource>(record);
            } else {
                throw new CustomException { HttpResponseCode = 404 };
            }
        }

        public async Task<ShipCrew> GetByIdToDelete(int id) {
            return await context.ShipCrews.SingleOrDefaultAsync(x => x.Id == id);
        }

        public int IsValid(ShipCrewWriteResource record) {
            return true switch {
                var x when x == !IsValidGender(record) => 450,
                var x when x == !IsValidNationality(record) => 451,
                var x when x == !IsValidShip(record) => 453,
                _ => 200,
            };
        }

        private bool IsValidGender(ShipCrewWriteResource record) {
            if (record.Id == 0) {
                return context.Genders.SingleOrDefault(x => x.Id == record.GenderId && x.IsActive) != null;
            }
            return context.Genders.SingleOrDefault(x => x.Id == record.GenderId) != null;

        }

        private bool IsValidNationality(ShipCrewWriteResource record) {
            if (record.Id == 0) {
                return context.Nationalities.SingleOrDefault(x => x.Id == record.NationalityId && x.IsActive) != null;
            }
            return context.Nationalities.SingleOrDefault(x => x.Id == record.NationalityId) != null;
        }

        private bool IsValidShip(ShipCrewWriteResource record) {
            if (record.Id == 0) {
                return context.Ships.SingleOrDefault(x => x.Id == record.ShipId && x.IsActive) != null;
            }
            return context.Ships.SingleOrDefault(x => x.Id == record.ShipId) != null;
        }

    }

}