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

namespace API.Features.ShipCrews {

    public class CrewRepository : Repository<Crew>, ICrewRepository {

        private readonly IMapper mapper;

        public CrewRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<CrewListResource>> Get() {
            List<Crew> records = await context.Crews
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(x => x.Nationality)
                .OrderBy(x => x.Ship.Description)
                    .ThenBy(x => x.Lastname)
                        .ThenBy(x => x.Firstname)
                            .ThenBy(x => x.Birthdate)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Crew>, IEnumerable<CrewListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Crew> records = await context.Crews
                .Where(x => x.IsActive)
                .OrderBy(x => x.Lastname).ThenBy(x => x.Firstname).ThenByDescending(x => x.Birthdate)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Crew>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<CrewReadResource> GetById(int id) {
            Crew record = await context.Crews
                .Include(x => x.Ship)
                .Include(x => x.Gender)
                .Include(x => x.Nationality)
                .SingleOrDefaultAsync(x => x.Id == id);
            if (record != null) {
                return mapper.Map<Crew, CrewReadResource>(record);
            } else {
                throw new RecordNotFound(ApiMessages.RecordNotFound());
            }
        }

        public async Task<Crew> GetByIdToDelete(int id) {
            return await context.Crews
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public int IsValid(CrewWriteResource record) {
            return true switch {
                var x when x == !IsValidGender(record) => 450,
                var x when x == !IsValidNationality(record) => 451,
                var x when x == !IsValidShip(record) => 452,
                _ => 200,
            };
        }

        private bool IsValidGender(CrewWriteResource record) {
            return context.Genders.SingleOrDefault(x => x.Id == record.GenderId && x.IsActive) != null;
        }

        private bool IsValidNationality(CrewWriteResource record) {
            return context.Nationalities.SingleOrDefault(x => x.Id == record.NationalityId && x.IsActive) != null;
        }

        private bool IsValidShip(CrewWriteResource record) {
            return context.Ships.SingleOrDefault(x => x.Id == record.ShipId && x.IsActive) != null;
        }

    }

}