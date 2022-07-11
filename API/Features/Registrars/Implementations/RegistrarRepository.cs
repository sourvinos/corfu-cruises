using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Registrars {

    public class RegistrarRepository : Repository<Registrar>, IRegistrarRepository {

        private readonly IMapper mapper;

        public RegistrarRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        async Task<IEnumerable<RegistrarListResource>> IRegistrarRepository.Get() {
            List<Registrar> records = await context.Registrars
                .Include(x => x.Ship)
                .OrderBy(x => x.Ship.Description)
                    .ThenBy(x => !x.IsPrimary)
                        .ThenBy(x => x.Fullname)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Registrar>, IEnumerable<RegistrarListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Registrar> records = await context.Registrars
                .Where(x => x.IsActive)
                .OrderBy(x => x.Fullname)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Registrar>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<RegistrarReadResource> GetById(int id) {
            Registrar record = await context.Registrars
                .Include(x => x.Ship)
                .SingleOrDefaultAsync(x => x.Id == id);
            return mapper.Map<Registrar, RegistrarReadResource>(record);
        }

        public async Task<Registrar> GetByIdToDelete(int id) {
            return await context.Registrars.SingleOrDefaultAsync(x => x.Id == id);
        }

        public int IsValid(RegistrarWriteResource record) {
            return true switch {
                var x when x == !IsValidShip(record) => 450,
                _ => 200,
            };
        }

        private bool IsValidShip(RegistrarWriteResource record) {
            if (record.Id == 0) {
                return context.Ships.SingleOrDefault(x => x.Id == record.ShipId && x.IsActive) != null;
            }
            return context.Ships.SingleOrDefault(x => x.Id == record.ShipId) != null;
        }

    }

}