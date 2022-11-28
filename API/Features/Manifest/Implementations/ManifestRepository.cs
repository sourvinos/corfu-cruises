using System;
using System.Collections.Generic;
using System.Linq;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Manifest {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(AppDbContext appDbContext, IHttpContextAccessor httpContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, httpContext, settings) {
            this.mapper = mapper;
        }

        public IEnumerable<Boo> Get(string date, int destinationId, int shipId, int[] portIds) {
            var manifest = context.Reservations
                .AsNoTracking()
                .Include(x => x.Destination)
                .Include(x => x.Port)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Include(x => x.Passengers).ThenInclude(x => x.Gender)
                .Include(x => x.Passengers).ThenInclude(x => x.Occupant)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId && portIds.Contains(x.PortId) && x.ShipId == shipId && x.Passengers.All(x => x.IsCheckedIn))
                .AsEnumerable()
                .GroupBy(x => new { x.Date, x.Destination.Description }).Select(x => new Boo {
                    Date = DateHelpers.DateToISOString(x.Key.Date),
                    Destination = x.Key.Description,
                    Passengers = x.SelectMany(x => x.Passengers.Select(x => new PassengerVM {
                        Lastname = x.Lastname,
                        Firstname = x.Firstname,
                        Birthdate = DateHelpers.DateToISOString(x.Birthdate),
                        Remarks = x.Remarks,
                        SpecialCare = x.SpecialCare,
                        Gender = x.Gender.Description,
                        NationalityCode = x.Nationality.Code.ToUpper(),
                        Occupant = x.Occupant.Description
                    })),
                    Crew = context.ShipCrews
                        .AsNoTracking()
                        .Where(x => x.ShipId == shipId)
                        .Select(x => new PassengerVM {
                            Lastname = x.Lastname,
                            Firstname = x.Firstname,
                            Birthdate = DateHelpers.DateToISOString(x.Birthdate),
                            Gender = x.Gender.Description,
                            NationalityCode = x.Nationality.Code.ToUpper(),
                            Occupant = x.Occupant.Description
                        })
                });
            // var crew = context.ShipCrews
            //     .AsNoTracking()
            //     .Include(x => x.Nationality)
            //     .Include(x => x.Gender)
            //     .Include(x => x.Occupant)
            //     .Where(x => x.ShipId == shipId)
            //     .Select(x => new PassengerVM {
            //         Lastname = x.Lastname,
            //         Firstname = x.Firstname,
            //         Birthdate = DateHelpers.DateToISOString(x.Birthdate),
            //         Gender = x.Gender.Description,
            //         NationalityCode = x.Nationality.Code.ToUpper(),
            //         Occupant = x.Occupant.Description
            //     });
            return manifest;
        }

    }

    public class Boo {

        public string Date { get; set; }
        public string Destination { get; set; }
        public IEnumerable<PassengerVM> Passengers { get; set; }
        public IEnumerable<PassengerVM> Crew { get; set; }

    }

    public class PassengerVM {

        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public string Remarks { get; set; }
        public string SpecialCare { get; set; }
        public string Gender { get; set; }
        public string NationalityCode { get; set; }
        public string Occupant { get; set; }

    }

}