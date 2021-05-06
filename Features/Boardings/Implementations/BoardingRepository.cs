using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace CorfuCruises {

    public class BoardingRepository : Repository<Reservation>, IBoardingRepository {

        private readonly IMapper mapper;

        public BoardingRepository(DbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public async Task<BoardingMainResultResource<BoardingResource>> Get(string date, int destinationId, int portId, int shipId) {
            var reservations = await context.Reservations
                .Include(x => x.Customer)
                .Include(x => x.Driver)
                .Include(x => x.Passengers)
                .Where(x => x.Date == date && x.DestinationId == destinationId && x.PortId == portId && x.ShipId == shipId)
                .Where(x => x.Date == date)
                .ToListAsync();
            int totalPersons = reservations.Sum(x => x.TotalPersons);
            int passengers = reservations.SelectMany(c => c.Passengers).Count();
            int boarded = reservations.SelectMany(c => c.Passengers).Where(x => x.IsCheckedIn).Count();
            int remaining = passengers - boarded;
            var groupPerDriver = context.Reservations.Include(x => x.Driver).Where(x => x.Date == date && x.DestinationId == destinationId && x.PortId == portId && x.ShipId == shipId).GroupBy(x => new { x.Driver.Description }).Select(x => new Driver { Description = x.Key.Description }).OrderBy(o => o.Description);
            var mainResult = new BoardingMainResult<Reservation> {
                TotalPersons = totalPersons,
                MissingNames = totalPersons - passengers,
                Passengers = passengers,
                Boarded = boarded,
                Remaining = remaining,
                Drivers = groupPerDriver.ToList(),
                Boardings = reservations.ToList()
            };
            return mapper.Map<BoardingMainResult<Reservation>, BoardingMainResultResource<BoardingResource>>(mainResult);
        }

        public bool DoBoarding(int id) {
            Passenger passenger = context.Passengers.Where(x => x.Id == id).FirstOrDefault();
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