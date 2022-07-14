using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Genders {

    public class GenderRepository : Repository<Gender>, IGenderRepository {

        private readonly IMapper mapper;

        public GenderRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<GenderListDto>> Get() {
            List<Gender> records = await context.Genders
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Gender>, IEnumerable<GenderListDto>>(records);
        }

        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            List<Gender> records = await context.Set<Gender>()
                .Where(x => x.IsActive)
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<Gender>, IEnumerable<SimpleResource>>(records);
        }

        public async Task<Gender> GetByIdToDelete(int id) {
            return await context.Genders.SingleOrDefaultAsync(x => x.Id == id);
        }

    }

}