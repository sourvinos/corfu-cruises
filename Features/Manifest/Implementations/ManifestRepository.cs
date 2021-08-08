using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ShipCruises.Manifest {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public ManifestResource Get(string date, int shipId, int portId) {
            var manifest = new ManifestViewModel {
                Date = date,
                Ship = context.Ships
                    .Include(x => x.Registrars)
                    .Include(x => x.ShipOwner)
                    .Include(x => x.Crew)
                        .ThenInclude(x => x.Nationality)
                    .SingleOrDefault(x => x.Id == shipId),
                Port = context.Ports.SingleOrDefault(x => x.Id == portId),
                Passengers = context.Passengers.Include(x => x.Nationality)
                    .Include(x => x.Occupant)
                    .Include(x => x.Gender)
                    .Where(x => x.IsCheckedIn && x.Reservation.Date == date)
                    .ToList()
            };
            return mapper.Map<ManifestViewModel, ManifestResource>(manifest);
        }

    }

}