using System;
using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Manifest {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        public ManifestRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, settings) { }

        public ManifestVM Get(string date, int destinationId, int shipId, int[] portIds) {
            return context.Reservations
                .AsNoTracking()
                .Include(x => x.Destination)
                .Include(x => x.Port)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId && portIds.Contains(x.PortId) && x.ShipId == shipId && x.Passengers.All(x => x.IsCheckedIn))
                .AsEnumerable()
                .GroupBy(x => new { x.Date, Destination = x.Destination.Description }).Select(x => new ManifestVM {
                    Date = DateHelpers.DateToISOString(x.Key.Date),
                    Destination = x.Key.Destination,
                    Passengers = x.SelectMany(x => x.Passengers).Select(x => new PassengerVM {
                        Lastname = x.Lastname,
                        Firstname = x.Firstname,
                        Birthdate = DateHelpers.DateToISOString(x.Birthdate),
                        Remarks = x.Remarks,
                        SpecialCare = x.SpecialCare,
                        Gender = x.Gender.Description,
                        NationalityDescription = x.Nationality.Description,
                        NationalityCode = x.Nationality.Code.ToUpper(),
                        Occupant = x.Occupant.Description
                    }).OrderBy(x => x.Lastname),
                    Crew = context.ShipCrews
                        .AsNoTracking()
                        .Where(x => x.ShipId == shipId)
                        .OrderBy(x => x.Lastname).ThenBy(x => x.Firstname).ThenByDescending(x => x.Birthdate)
                        .Select(x => new PassengerVM {
                            Lastname = x.Lastname,
                            Firstname = x.Firstname,
                            Birthdate = DateHelpers.DateToISOString(x.Birthdate),
                            Gender = x.Gender.Description,
                            NationalityCode = x.Nationality.Code.ToUpper(),
                            NationalityDescription = x.Nationality.Description,
                            Occupant = x.Occupant.Description
                        }).OrderBy(x => x.Lastname)
                })
                .SingleOrDefault();
        }

    }

}