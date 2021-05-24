using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace CorfuCruises.Manifest {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public IEnumerable<ManifestResource> Get(string date, int shipId, int portId) {
            var manifest = context.Reservations
                .Include(x => x.Ship).ThenInclude(x => x.DataEntryPersons)
                .Include(x => x.Port)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .AsEnumerable()
                .Where(x => x.Date == date && x.ShipId == shipId && x.PortId == portId && x.Passengers.Any(x => x.IsCheckedIn))
                .GroupBy(x => new { x.Date, x.Ship, x.Port })
                .Select(x => new ManifestViewModel {
                    Date = x.Key.Date,
                    Ship = x.Key.Ship,
                    Port = x.Key.Port.Description,
                    Passengers = x.SelectMany(x => x.Passengers).ToList()
                });
            return mapper.Map<IEnumerable<ManifestResource>>(manifest);
        }

    }

}