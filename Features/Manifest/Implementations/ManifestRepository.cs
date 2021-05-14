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

        public IEnumerable<ManifestResource> Get(string date, int shipId, int shipRouteId) {
            var manifest = context.Reservations
                .Include(x => x.Ship)
                .Include(x => x.ShipRoute)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .AsEnumerable()
                .Where(x => x.Date == date && x.ShipId == shipId && x.ShipRouteId == shipRouteId && x.Passengers.Any(x => x.IsCheckedIn))
                .GroupBy(x => new { x.Date, x.Ship, x.ShipRoute })
                .Select(x => new ManifestViewModel {
                    Date = x.Key.Date,
                    Ship = x.Key.Ship.Description,
                    Route = x.Key.ShipRoute.Description,
                    Passengers = x.SelectMany(x => x.Passengers).ToList()
                });
            return mapper.Map<IEnumerable<ManifestResource>>(manifest);
        }

    }

}