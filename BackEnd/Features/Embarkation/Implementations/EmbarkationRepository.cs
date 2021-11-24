using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BlueWaterCruises.Features.Drivers;
using BlueWaterCruises.Features.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BlueWaterCruises.Features.Embarkation {

    public class EmbarkationRepository : Repository<Reservation>, IEmbarkationRepository {

        private readonly IMapper mapper;

        public EmbarkationRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public async Task<EmbarkationMainResultResource<EmbarkationResource>> Get(string date, int destinationId, int portId, int shipId) {
            var reservations = await context.Set<Reservation>()
                .Include(x => x.Customer)
                .Include(x => x.Driver)
                .Include(x => x.Passengers)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId && x.PortId == portId && x.ShipId == shipId)
                .ToListAsync();
            int totalPersons = reservations.Sum(x => x.TotalPersons);
            int passengers = reservations.SelectMany(c => c.Passengers).Count();
            int boarded = reservations.SelectMany(c => c.Passengers).Where(x => x.IsCheckedIn).Count();
            int remaining = passengers - boarded;
            var groupPerDriver = context.Set<Reservation>().Include(x => x.Driver)
                .Where(x => x.Date == Convert.ToDateTime(date) && x.DestinationId == destinationId && x.PortId == portId && x.ShipId == shipId)
                .GroupBy(x => new { x.Driver.Description })
                .Select(x => new Driver {
                    Description = x.Key.Description
                })
                .OrderBy(o => o.Description);
            var mainResult = new EmbarkationMainResult<Reservation> {
                TotalPersons = totalPersons,
                MissingNames = totalPersons - passengers,
                Passengers = passengers,
                Boarded = boarded,
                Remaining = remaining,
                Drivers = groupPerDriver.ToList(),
                Embarkation = reservations.ToList()
            };
            return mapper.Map<EmbarkationMainResult<Reservation>, EmbarkationMainResultResource<EmbarkationResource>>(mainResult);
        }

        public bool DoEmbarkation(int id) {
            Passenger passenger = context.Set<Passenger>().Where(x => x.Id == id).FirstOrDefault();
            if (passenger != null) {
                passenger.IsCheckedIn = !passenger.IsCheckedIn;
                context.SaveChanges();
                return true;
            } else {
                return false;
            }
        }

    }

}