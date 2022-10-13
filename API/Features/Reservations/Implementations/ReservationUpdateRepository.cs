using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.Reservations {

    public class ReservationUpdateRepository : Repository<Reservation>, IReservationUpdateRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly TestingEnvironment testingEnvironment;

        public ReservationUpdateRepository(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment) : base(context, testingEnvironment) {
            this.httpContext = httpContext;
            this.testingEnvironment = testingEnvironment.Value;
        }

        public void Update(Guid reservationId, Reservation reservation) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                if (Identity.IsUserAdmin(httpContext)) {
                    context.Entry(reservation).State = EntityState.Modified;
                }
                AddPassengers(reservation.Passengers);
                EditPassengers(reservation.Passengers);
                DeletePassengers(reservationId, reservation.Passengers);
                context.Reservations.Update(reservation);
                context.SaveChanges();
                if (testingEnvironment.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public void AssignToDriver(int driverId, string[] ids) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                var reservations = context.Reservations
                    .Where(x => ids.Contains(x.ReservationId.ToString()))
                    .ToList();
                reservations.ForEach(a => a.DriverId = driverId);
                context.SaveChanges();
                if (testingEnvironment.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public void AssignToShip(int shipId, string[] ids) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                var reservations = context.Reservations
                    .Where(x => ids.Contains(x.ReservationId.ToString()))
                    .ToList();
                reservations.ForEach(a => a.ShipId = shipId);
                context.SaveChanges();
                if (testingEnvironment.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public async Task<string> AssignRefNoToNewDto(ReservationWriteDto reservation) {
            return await GetDestinationAbbreviation(reservation) + DateHelpers.GetRandomizedUnixTime();
        }

        public ReservationWriteDto AttachUserIdToDto(ReservationWriteDto reservation) {
            return Identity.PatchEntityWithUserId(httpContext, reservation);
        }

        private async Task<string> GetDestinationAbbreviation(ReservationWriteDto reservation) {
            var destination = await context.Destinations
                .AsNoTracking()
                .Where(x => x.Id == reservation.DestinationId)
                .SingleAsync();
            return destination.Abbreviation;
        }

        private void AddPassengers(List<Passenger> passengers) {
            var passengersToAdd = passengers.Where(x => x.Id == 0).ToList();
            context.Passengers.AddRange(passengersToAdd);
        }

        private void EditPassengers(List<Passenger> passengers) {
            var updatedPassengers = passengers.Where(x => x.Id != 0).ToList();
            foreach (var passenger in updatedPassengers) {
                context.Entry(passenger).State = EntityState.Modified;
                context.Passengers.Update(passenger);
            }
        }

        private void DeletePassengers(Guid reservationId, List<Passenger> passengers) {
            var existingPassengers = context.Passengers.Where(x => x.ReservationId == reservationId).AsNoTracking().ToList();
            var updatedPassengers = passengers.Where(x => x.Id != 0).ToList();
            var passengersToDelete = existingPassengers.Except(updatedPassengers, new PassengerComparerById()).ToList();
            context.Passengers.RemoveRange(passengersToDelete);
        }

        private class PassengerComparerById : IEqualityComparer<Passenger> {
            public bool Equals(Passenger x, Passenger y) {
                return x.Id == y.Id;
            }
            public int GetHashCode(Passenger x) {
                return x.Id.GetHashCode();
            }
        }

    }

}