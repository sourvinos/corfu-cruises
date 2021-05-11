using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CorfuCruises {

    public class DbInit {

        public static void Seed(IApplicationBuilder applicationBuilder) {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope()) {
                var context = serviceScope.ServiceProvider.GetService<DbContext>();
                if (!context.Reservations.Any()) {
                    context.Reservations.AddRange(CreateReservation(context));
                    context.SaveChanges();
                    context.Passengers.AddRange(CreatePassenger(context));
                    context.SaveChanges();
                }
            }
        }

        private static Reservation[] CreateReservation(DbContext context) {
            var records = new Reservation[1000];
            for (int i = 0; i < records.Length; i++) {
                var pickupPointId = RandomNumber(1, 336);
                var portId = context.PickupPoints.Include(x => x.Route).ThenInclude(x => x.Port).Where(x => x.Id == pickupPointId).Select(x => x.Route.Port.Id).SingleOrDefault();
                records[i] = new Reservation {
                    ReservationId = new Guid(),
                    Adults = RandomNumber(1, 10),
                    Kids = RandomNumber(1, 5),
                    Free = RandomNumber(1, 3),
                    TicketNo = RandomString(5),
                    Email = RandomEmail(20),
                    Phones = RandomPhone(10),
                    CustomerId = RandomNumber(1, 146),
                    DestinationId = RandomNumber(1, 4),
                    DriverId = RandomNumber(1, 5),
                    PickupPointId = pickupPointId,
                    PortId = portId,
                    ShipId = RandomNumber(1, 3),
                    Remarks = "",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da"
                };
            }
            return records;
        }

        private static List<Passenger> CreatePassenger(DbContext context) {

            List<Passenger> passengers = new List<Passenger>();
            foreach (var reservation in context.Reservations) {
                for (int i = 1; i <= 1; i++) {
                    var passengersPerReservation = RandomNumber(1, 5);
                    for (int passenger = 1; passenger < passengersPerReservation; passenger++) {
                        passengers.Add(new Passenger {
                            ReservationId = reservation.ReservationId,
                            OccupantId = 2,
                            NationalityId = RandomNumber(2, 4),
                            GenderId = RandomNumber(1, 3),
                            Lastname = RandomString(25),
                            Firstname = RandomString(20),
                            // DOB = RandomDOB(),
                            SpecialCare = "",
                            Remarks = "",
                            IsCheckedIn = false
                        });
                    }
                }
            }
            return passengers;
        }

        private static DateTime RandomDate() {
            return DateTime.UtcNow.AddDays(new Random().Next(30));
        }

        private static DateTime RandomDOB() {
            return DateTime.UtcNow.AddDays(new Random().Next(30));
        }

        private static Int32 RandomNumber(int min, int max) {
            int persons = new Random().Next(minValue: min, maxValue: max);
            return persons;
        }

        private static string RandomPhone(int size) {
            var builder = new StringBuilder(size);
            char offset = '0';
            const int lettersOffset = 9;
            for (var i = 0; i < size; i++) {
                var @char = (char)new Random().Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }
            return builder.ToString();
        }

        private static string RandomEmail(int length, bool lowerCase = true) {
            var builder = new StringBuilder(length);
            char offset = lowerCase ? 'a' : 'A';
            const int lettersOffset = 26;
            for (var i = 0; i < length / 2; i++) {
                var @char = (char)new Random().Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }
            builder.Append("@");
            for (var i = 0; i < length / 3; i++) {
                var @char = (char)new Random().Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }
            builder.Append(".");
            for (var i = 0; i < 3; i++) {
                var @char = (char)new Random().Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }
            return lowerCase ? builder.ToString().ToLower() : builder.ToString();
        }

        private static string RandomString(int length) {
            var builder = new StringBuilder(length);
            char offset = 'A';
            const int lettersOffset = 26;
            for (var i = 0; i < length; i++) {
                var @char = (char)new Random().Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }
            return builder.ToString();
        }

    }

}