using System;
using System.Collections.Generic;
using System.Linq;
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

        public ReservationUpdateRepository(AppDbContext context, IHttpContextAccessor httpContext, IOptions<TestingEnvironment> testingEnvironment) : base(context, httpContext, testingEnvironment) {
            this.httpContext = httpContext;
            this.testingEnvironment = testingEnvironment.Value;
        }

        public void Update(Guid reservationId, Reservation reservation) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                UpdateReservation(reservation);
                AddPassengers(reservation.Passengers);
                UpdatePassengers(reservation.Passengers);
                DeletePassengers(reservationId, reservation.Passengers);
                context.Reservations.Update(reservation);
                context.SaveChangesAsync();
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
                context.SaveChangesAsync();
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
                context.SaveChangesAsync();
                if (testingEnvironment.IsTesting) {
                    transaction.Dispose();
                } else {
                    transaction.Commit();
                }
            });
        }

        public string AssignRefNoToNewDto(ReservationWriteDto reservation) {
            return GetDestinationAbbreviation(reservation) + DateHelpers.GetRandomizedUnixTime();
        }

        private string GetDestinationAbbreviation(ReservationWriteDto reservation) {
            var destination = context.Destinations
                .AsNoTracking()
                .Where(x => x.Id == reservation.DestinationId)
                .SingleOrDefault();
            return destination.Abbreviation;
        }

        private void UpdateReservation(Reservation reservation) {
            if (Identity.IsUserAdmin(httpContext)) {
                context.Reservations.Update(reservation);
            }
        }

        private void AddPassengers(List<Passenger> passengers) {
            context.Passengers.AddRange(passengers.Where(x => x.Id == 0));
        }

        private void UpdatePassengers(List<Passenger> passengers) {
            context.Passengers.UpdateRange(passengers.Where(x => x.Id != 0));
        }

        private void DeletePassengers(Guid reservationId, List<Passenger> passengers) {
            var existingPassengers = context.Passengers
                .AsNoTracking()
                .Where(x => x.ReservationId == reservationId)
                .ToList();
            var updatedPassengers = passengers
                .Where(x => x.Id != 0)
                .ToList();
            var passengersToDelete = existingPassengers
                .Except(updatedPassengers, new PassengerComparerById())
                .ToList();
            context.Passengers
                .RemoveRange(passengersToDelete);
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