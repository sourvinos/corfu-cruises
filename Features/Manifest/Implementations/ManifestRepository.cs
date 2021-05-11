using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CorfuCruises {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ManifestResource>> Get(string date) {
            var manifest = await context.Reservations
                .Include(x => x.Ship)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .Where(x => x.Date == date && x.Passengers.Any(x => x.IsCheckedIn))
                .ToListAsync();
            return mapper.Map<IEnumerable<Reservation>, IEnumerable<ManifestResource>>(manifest);
        }

    }

}