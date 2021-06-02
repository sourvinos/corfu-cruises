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

        public ManifestResource Get(string date, int shipId, int portId) {
            var manifest = context.Reservations
                .Include(x => x.Ship).ThenInclude(x => x.ShipOwner)
                .Include(x => x.Ship).ThenInclude(x => x.DataEntryPersons)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .Where(x => x.Date == date && x.ShipId == shipId && x.PortId == portId && x.Passengers.Any(x => x.IsCheckedIn))
                .Select(x => new ManifestViewModel {
                    Date = x.Date,
                    Ship = new Ship {
                        Id = x.Ship.Id,
                        ShipOwnerId = x.Ship.ShipOwner.Id,
                        Description = x.Ship.Description,
                        Manager = x.Ship.Manager,
                        ManagerInGreece = x.Ship.ManagerInGreece,
                        Agent = x.Ship.Agent,
                        Flag = x.Ship.Flag,
                        RegistryNo = x.Ship.RegistryNo,
                        IMO = x.Ship.IMO,
                        ShipOwner = x.Ship.ShipOwner,
                        DataEntryPersons = x.Ship.DataEntryPersons.OrderBy(x => x.IsPrimary).ToList()
                    },
                    Port = x.Port.Description,
                    Passengers = x.Passengers.ToList()
                }).FirstOrDefault();
            return mapper.Map<ManifestViewModel, ManifestResource>(manifest);
        }

    }

}