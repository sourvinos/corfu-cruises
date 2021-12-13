using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BlueWaterCruises.Features.Nationalities {

    public class NationalityRepository : Repository<Nationality>, INationalityRepository {

        private readonly IMapper mapper;

        public NationalityRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<NationalityListResource>> Get() {
            List<Nationality> records = await context.Nationalities
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Nationality>, IEnumerable<NationalityListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Nationality> records = await context.Nationalities
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Nationality>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<NationalityReadResource> GetById(int id) {
            Nationality record = await context.Nationalities
                .SingleOrDefaultAsync(m => m.Id == id);
            return mapper.Map<Nationality, NationalityReadResource>(record);
        }

        public async Task<Nationality> GetByIdToDelete(int id) {
            return await context.Nationalities
                .SingleOrDefaultAsync(m => m.Id == id);
        }

    }

}