using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Genders {

    public class GenderRepository : Repository<Gender>, IGenderRepository {

        private readonly IMapper mapper;

        public GenderRepository(AppDbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<GenderListResource>> Get() {
            List<Gender> records = await context.Genders
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Gender>, IEnumerable<GenderListResource>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Gender> records = await context.Set<Gender>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Gender>, IEnumerable<SimpleResource>>(records);
        }

        public new async Task<GenderReadResource> GetById(int id) {
            Gender record = await context.Genders
                .SingleOrDefaultAsync(x => x.Id == id);
            return mapper.Map<Gender, GenderReadResource>(record);
        }

        public async Task<Gender> GetByIdToDelete(int id) {
            return await context.Genders
                .SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}