using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ShipCruises.Features.Reservations;
using System.Linq;

namespace ShipCruises.Features.Manifest {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public ManifestResource Get(string date, int destinationId, int portId, int vesselId) {
            var manifest=new ManifestViewModel();
            // var manifest = new ManifestViewModel {
            //     Date = date,
            //     ShipResource = context.Ships
            //         .Include(x => x.Registrars.Where(x => x.IsActive))
            //         .Include(x => x.ShipOwner)
            //         .Include(x => x.Crew.Where(x => x.IsActive))
            //             .ThenInclude(x => x.Nationality)
            //         .SingleOrDefault(x => x.Id == vesselId),
            //     Port = context.Ports.SingleOrDefault(x => x.Id == portId),
            //     Passengers = context.Passengers
            //         .Include(x => x.Nationality)
            //         .Include(x => x.Occupant)
            //         .Include(x => x.Gender)
            //         .Where(x => x.Reservation.Date == date && x.Reservation.DestinationId == destinationId && x.Reservation.ShipId == vesselId && x.IsCheckedIn)
            //         .ToList()
            // };
            return mapper.Map<ManifestViewModel, ManifestResource>(manifest);
        }

    }

}