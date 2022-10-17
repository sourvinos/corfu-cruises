using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace API.Features.Manifest {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, ILogger<Reservation> logger, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, logger, settings) {
            this.mapper = mapper;
        }

        public ManifestFinalVM Get(string date, int destinationId, string portId, int shipId, int shipRouteId) {
            var manifest = new ManifestInitialVM {
                Date = date,
                Destination = context.Destinations
                    .AsNoTracking()
                    .Select(x => new SimpleEntity {
                        Id = x.Id,
                        Description = x.Description
                    })
                    .FirstOrDefault(x => x.Id == destinationId),
                Port = GetPortDescription(portId),
                Ship = context.Ships
                    .AsNoTracking()
                    .Include(x => x.ShipOwner)
                    .Include(x => x.Registrars.Where(x => x.IsActive))
                    .Include(x => x.ShipCrews.Where(x => x.IsActive))
                    .Include(x => x.ShipCrews.Where(x => x.IsActive)).ThenInclude(x => x.Gender)
                    .Include(x => x.ShipCrews.Where(x => x.IsActive)).ThenInclude(x => x.Nationality)
                    .Include(x => x.ShipCrews.Where(x => x.IsActive)).ThenInclude(x => x.Occupant)
                    .FirstOrDefault(x => x.Id == shipId),
                ShipRoute = context.ShipRoutes
                    .AsNoTracking()
                    .FirstOrDefault(x => x.Id == shipRouteId),
                Passengers = context.Passengers
                    .AsNoTracking()
                    .Include(x => x.Nationality)
                    .Include(x => x.Occupant)
                    .Include(x => x.Gender)
                    .Where(x => x.Reservation.Date.ToString() == date
                        && x.Reservation.DestinationId == destinationId
                        && x.Reservation.ShipId == shipId
                        && ((portId == "all") || x.Reservation.PickupPoint.CoachRoute.PortId == int.Parse(portId))
                        && x.IsCheckedIn)
                    .ToList()
            };
            return mapper.Map<ManifestInitialVM, ManifestFinalVM>(manifest);
        }

        private string GetPortDescription(string portId) {
            if (portId != "all") {
                var port = context.Ports
                    .AsNoTracking()
                    .FirstOrDefault(x => x.Id == int.Parse(portId));
                return port.Description;
            }
            return portId;
        }

    }

}