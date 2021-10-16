using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using BlueWaterCruises.Features.Reservations;

public static class SeedDatabasePassengers {

    public static void SeedPassengers(AppDbContext context) {
        if (context.Passengers.Count() == 0) {
            var reservationIds = context.Reservations.Select(x => x.ReservationId).ToList();
            for (int i = 1; i <= reservationIds.Count(); i++) {
                var customerCount = Helpers.CreateRandomPassengerCount(1, 5);
                List<Passenger> passengers = new();
                for (int x = 1; x <= customerCount; x++) {
                    var passenger = new Passenger {
                        ReservationId = reservationIds[i - 1],
                        OccupantId = context.Occupants.Where(x => x.Description.ToLower() == "passenger").Select(x => x.Id).FirstOrDefault(),
                        NationalityId = context.Nationalities.Skip(Helpers.CreateRandomInteger(0, context.Nationalities.Count())).Take(1).Select(x => x.Id).FirstOrDefault(),
                        GenderId = context.Genders.Skip(Helpers.CreateRandomInteger(0, context.Genders.Count())).Take(1).Select(x => x.Id).FirstOrDefault(),
                        Lastname = Helpers.CreateRandomName().Split(" ")[0],
                        Firstname = Helpers.CreateRandomName().Split(" ")[1],
                        Birthdate = Helpers.CreateRandomDate(),
                        SpecialCare = Helpers.CreateRandomString(i),
                        Remarks = Helpers.CreateRandomString(x),
                        IsCheckedIn = false
                    };
                    passengers.Add(passenger);
                }
                context.AddRange(passengers);
                context.SaveChanges();
            }
        }
    }

}