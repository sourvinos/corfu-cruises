using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CorfuCruises {

    public class What {
        public string Date { get; set; }
        public string Ship { get; set; }
        public string Destination { get; set; }
        public List<Passenger> Passengers { get; set; }
    }

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        IEnumerable<What> IManifestRepository.Get(string date) {
            var manifest = context.Reservations
                .Include(x => x.Ship)
                .Include(x => x.Destination)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .AsEnumerable()
                .Where(x => x.Date == date && x.Passengers.Any(x => x.IsCheckedIn))
                .GroupBy(x => new { x.Date, x.Ship, x.Destination })
                .Select(x => new What {
                    Date = x.Key.Date,
                    Ship = x.Key.Ship.Description,
                    Destination = x.Key.Destination.Description,
                    Passengers = x.SelectMany(x => x.Passengers).ToList()
                });
            return manifest;
        }

    }

}