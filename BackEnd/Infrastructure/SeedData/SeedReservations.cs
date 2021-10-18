using System;
using System.Collections.Generic;
using System.Linq;
using BlueWaterCruises;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Routes;
using BlueWaterCruises.Features.Schedules;

public static class SeedDatabaseReservations {

    public static void SeedReservations(AppDbContext context) {
        if (context.Reservations.Count() == 0) {
            List<Reservation> reservations = new();
            for (int i = 1; i <= 500; i++) {
                Schedule schedule = context.Schedules.SingleOrDefault(x => x.Id == Helpers.CreateRandomInteger(1, context.Schedules.Count() + 1));
                List<Route> routes = context.Routes.Where(x => x.PortId == schedule.PortId).ToList();
                Route route = routes.Skip(Helpers.CreateRandomInteger(0, routes.Count())).Take(1).FirstOrDefault();
                List<PickupPoint> pickupPoints = context.PickupPoints.Where(x => x.RouteId == route.Id).ToList();
                PickupPoint pickupPoint = pickupPoints.Skip(Helpers.CreateRandomInteger(0, pickupPoints.Count())).Take(1).FirstOrDefault();
                if (schedule != null) {
                    var reservation = new Reservation {
                        ReservationId = new Guid(),
                        Date = schedule.Date,
                        Adults = Helpers.CreateRandomInteger(1, 5),
                        Kids = Helpers.CreateRandomInteger(1, 3),
                        Free = Helpers.CreateRandomInteger(1, 2),
                        TicketNo = Helpers.CreateRandomTicketNo(5),
                        Email = Helpers.CreateRandomName() + "@" + Helpers.CreateRandomEmail(),
                        Phones = "",
                        CustomerId = Helpers.CreateRandomInteger(1, 10),
                        DestinationId = schedule.DestinationId,
                        DriverId = Helpers.CreateRandomInteger(1, 4),
                        PickupPointId = pickupPoint.Id,
                        PortId = schedule.PortId,
                        ShipId = Helpers.CreateRandomInteger(1, 2),
                        Remarks = Helpers.CreateRandomString(i),
                        UserId = context.Users.Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).SingleOrDefault()
                    };
                    reservations.Add(reservation);
                }
            }
            context.AddRange(reservations);
            context.SaveChanges();
        }
    }

}