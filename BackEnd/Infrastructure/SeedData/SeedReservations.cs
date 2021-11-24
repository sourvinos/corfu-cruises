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
            for (int i = 1; i <= 50; i++) {
                Schedule schedule = context.Schedules.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Schedules.Count())).Take(1).FirstOrDefault();
                List<Route> routes = context.Routes.Where(x => x.PortId == schedule.PortId).ToList();
                Route route = routes.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, routes.Count())).Take(1).FirstOrDefault();
                List<PickupPoint> pickupPoints = context.PickupPoints.Where(x => x.RouteId == route.Id).ToList();
                PickupPoint pickupPoint = pickupPoints.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, pickupPoints.Count())).Take(1).FirstOrDefault();
                if (schedule != null) {
                    var reservation = new Reservation {
                        ReservationId = Guid.NewGuid(),
                        Date = schedule.Date,
                        Adults = Helpers.CreateRandomInteger(1, 5),
                        Kids = Helpers.CreateRandomInteger(1, 3),
                        Free = Helpers.CreateRandomInteger(1, 2),
                        TicketNo = Helpers.CreateRandomTicketNo(5),
                        Email = Helpers.CreateRandomEmail(),
                        Phones = Helpers.CreateRandomPhones(),
                        CustomerId = context.Customers.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Customers.Count())).Take(1).Select(x => x.Id).FirstOrDefault(),
                        DestinationId = schedule.DestinationId,
                        DriverId = context.Drivers.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Drivers.Count())).Take(1).Select(x => x.Id).FirstOrDefault(),
                        PickupPointId = pickupPoint.Id,
                        PortId = schedule.PortId,
                        ShipId = context.Ships.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Ships.Count())).Take(1).Select(x => x.Id).FirstOrDefault(),
                        Remarks = Helpers.CreateRandomSentence(i),
                        UserId = context.Users.OrderBy(x => x.Id).Skip(Helpers.CreateRandomInteger(0, context.Users.Count())).Take(1).Select(x => x.Id).FirstOrDefault()
                    };
                    reservations.Add(reservation);
                }
            }
            context.AddRange(reservations);
            context.SaveChanges();
        }
    }

}