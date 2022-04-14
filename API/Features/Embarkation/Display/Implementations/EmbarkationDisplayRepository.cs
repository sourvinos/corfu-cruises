using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Embarkation.Display;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Embarkation {

    public class EmbarkationDisplayRepository : Repository<Reservation>, IEmbarkationDisplayRepository {

        private readonly IMapper mapper;
        private readonly TestingEnvironment testingSettings;

        public EmbarkationDisplayRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> testingSettings) : base(appDbContext, testingSettings) {
            this.mapper = mapper;
            this.testingSettings = testingSettings.Value;
        }

        public async Task<EmbarkationDisplayGroupVM<EmbarkationDisplayVM>> Get(string date, int destinationId, int portId, string shipId) {
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
            int remaining = passengers - boarded;
            var mainResult = new EmbarkationDisplayGroupDto<Reservation> {
                PassengerCount = totalPersons,
                PassengerCountWithNames = passengers,
                BoardedCount = boarded,
                RemainingCount = remaining,
                PassengerCountWithNoNames = totalPersons - passengers,
                Embarkation = reservations.ToList()
            };
            return mapper.Map<EmbarkationDisplayGroupDto<Reservation>, EmbarkationDisplayGroupVM<EmbarkationDisplayVM>>(mainResult);
        }

        public bool DoEmbarkation(int id) {
            Passenger passenger = context.Passengers.Where(x => x.Id == id).FirstOrDefault();
            if (passenger != null) {
                using var transaction = context.Database.BeginTransaction();
                passenger.IsCheckedIn = !passenger.IsCheckedIn;
                context.SaveChanges();
                if (testingSettings.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
                return true;
            } else {
                return false;
            }
        }

        public async Task<int> GetShipIdFromDescription(string description) {
            var ship = await context.Ships.FirstOrDefaultAsync(x => x.Description == description);
            return ship.Id;
        }

    }

}
