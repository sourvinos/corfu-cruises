using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Embarkation {

    public class EmbarkationRepository : Repository<Reservation>, IEmbarkationRepository {

        private readonly IMapper mapper;
        private readonly TestingEnvironment settings;

        public EmbarkationRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
            this.settings = settings.Value;
        }

        public async Task<EmbarkationGroupVM<EmbarkationVM>> Get(string date, int destinationId, int portId, string shipId) {
            var reservations = await context.Set<Reservation>()
                .Include(x => x.Customer)
                .Include(x => x.Driver)
                .Include(x => x.Ship)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Where(x => x.ShipId != null)
                .Where(x => x.Date == Convert.ToDateTime(date)
                    && x.DestinationId == destinationId
                    && x.PortId == portId
                    && ((shipId == "all") || x.ShipId == int.Parse(shipId)))
                .ToListAsync();
            int totalPersons = reservations.Sum(x => x.TotalPersons);
            int passengers = reservations.Sum(c => c.Passengers.Count);
            int boarded = reservations.SelectMany(c => c.Passengers).Count(x => x.IsCheckedIn);
            int remaining = totalPersons - boarded;
            var mainResult = new EmbarkationDisplayGroupDto<Reservation> {
                PassengerCount = totalPersons,
                PassengerCountWithNames = passengers,
                BoardedCount = boarded,
                RemainingCount = remaining,
                PassengerCountWithNoNames = totalPersons - passengers,
                Embarkation = reservations.ToList()
            };
            return mapper.Map<EmbarkationDisplayGroupDto<Reservation>, EmbarkationGroupVM<EmbarkationVM>>(mainResult);
        }

        public async Task<int> GetShipIdFromDescription(string description) {
            var ship = await context.Ships.FirstOrDefaultAsync(x => x.Description == description);
            return ship.Id;
        }

        public bool EmbarkSinglePassenger(int id) {
            Passenger passenger = context.Passengers.Where(x => x.Id == id).FirstOrDefault();
            if (passenger != null) {
                using var transaction = context.Database.BeginTransaction();
                passenger.IsCheckedIn = !passenger.IsCheckedIn;
                context.SaveChanges();
                if (settings.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
                return true;
            } else {
                return false;
            }
        }

        public bool EmbarkAllPassengers(int[] id) {
            using var transaction = context.Database.BeginTransaction();
            var records = context.Passengers
                .Where(x => id.Contains(x.Id))
                .ToList();
            records.ForEach(x => x.IsCheckedIn = true);
            context.SaveChanges();
            if (settings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
            return true;
        }

    }

}
