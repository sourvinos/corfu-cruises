using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;

namespace API.Features.Embarkation {

    public class EmbarkationRepository : Repository<Reservation>, IEmbarkationRepository {

        private readonly IMapper mapper;
        private readonly TestingEnvironment testingSettings;

        public EmbarkationRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> testingSettings) : base(appDbContext, testingSettings) {
            this.mapper = mapper;
            this.testingSettings = testingSettings.Value;
        }

        public async Task<EmbarkationGroupVM<EmbarkationVM>> Get(string date, string destinationId, string portId, string shipId) {
            var reservations = await context.Set<Reservation>()
                .Include(x => x.Customer)
                .Include(x => x.Destination)
                .Include(x => x.Driver)
                .Include(x => x.Ship)
                .Include(x => x.Port)
                .Include(x => x.Passengers).ThenInclude(x => x.Nationality)
                .Where(x => x.ShipId != null)
                .Where(x => x.Date == Convert.ToDateTime(date)
                    && ((destinationId == "all") || x.DestinationId == int.Parse(destinationId))
                    && ((portId == "all") || x.PortId == int.Parse(portId))
                    && ((shipId == "all") || x.ShipId == int.Parse(shipId)))
                .ToListAsync();
            int totalPersons = reservations.Sum(x => x.TotalPersons);
            int embarkedPassengers = reservations.SelectMany(c => c.Passengers).Count(x => x.IsCheckedIn);
            int remainingPersons = totalPersons - embarkedPassengers;
            var mainResult = new EmbarkationGroupDto<Reservation> {
                TotalPersons = totalPersons,
                EmbarkedPassengers = embarkedPassengers,
                PendingPersons = remainingPersons,
                Reservations = reservations.ToList()
            };
            return mapper.Map<EmbarkationGroupDto<Reservation>, EmbarkationGroupVM<EmbarkationVM>>(mainResult);
        }

        public async Task<int> GetShipIdFromDescription(string description) {
            var ship = await context.Ships.FirstOrDefaultAsync(x => x.Description == description);
            return ship.Id;
        }

        public void EmbarkSinglePassenger(int id) {
            Passenger passenger = context.Passengers.Where(x => x.Id == id).FirstOrDefault();
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                passenger.IsCheckedIn = !passenger.IsCheckedIn;
                context.SaveChanges();
                DisposeOrCommit(transaction);
            });
        }

        public void EmbarkAllPassengers(int[] id) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                var records = context.Passengers
                    .Where(x => id.Contains(x.Id))
                    .ToList();
                records.ForEach(x => x.IsCheckedIn = true);
                context.SaveChanges();
                DisposeOrCommit(transaction);
            });
        }

        private void DisposeOrCommit(IDbContextTransaction transaction) {
            if (testingSettings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
        }

    }

}
