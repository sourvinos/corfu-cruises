using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises.Features.Nationalities {

    public class NationalityRepository : Repository<Nationality>, INationalityRepository {

        private readonly IMapper mapper;

        public NationalityRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<NationalityDropdownResource>> GetActiveForDropdown() {
            var records = await context
                .Set<Nationality>()
                .Where(x => x.IsActive)
                .ToListAsync();
            return mapper.Map<IEnumerable<Nationality>, IEnumerable<NationalityDropdownResource>>(records);
        }

    }

}