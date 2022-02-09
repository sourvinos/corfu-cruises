using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Manifest {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public ManifestResource Get(string date, int destinationId, int portId, int shipId) {
            var manifest = new ManifestViewModel {
                Date = date,
                Ship = context.Ships
                    .Include(x => x.ShipOwner)
                    .Include(x => x.Registrars.Where(x => x.IsActive))
                    .Include(x => x.Crews.Where(x => x.IsActive)).ThenInclude(x => x.Nationality)
                    .Include(x => x.Crews.Where(x => x.IsActive)).ThenInclude(x => x.Occupant)
                    .SingleOrDefault(x => x.Id == shipId),
                Port = context.Ports.SingleOrDefault(x => x.Id == portId),
                Passengers = context.Passengers
                    .Include(x => x.Nationality)
                    .Include(x => x.Occupant)
                    .Include(x => x.Gender)
                    .Where(x => x.Reservation.Date.ToString() == date && x.Reservation.DestinationId == destinationId && x.Reservation.ShipId == shipId && x.IsCheckedIn)
                    .ToList()
            };
            return mapper.Map<ManifestViewModel, ManifestResource>(manifest);
        }

    }

}