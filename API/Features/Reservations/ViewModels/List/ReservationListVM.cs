using System;
using API.Infrastructure.Classes;

namespace API.Features.Reservations {

    public class ReservationListVM {

        public Guid ReservationId { get; set; }

        public string Date { get; set; }
        public string RefNo { get; set; }
        public string TicketNo { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }

        public SimpleEntity Customer { get; set; }
        public SimpleEntity CoachRoute { get; set; }
        public DestinationListVM Destination { get; set; }
        public DriverListVM Driver { get; set; }
        public PickupPointListVM PickupPoint { get; set; }
        public PortListVM Port { get; set; }
        public SimpleEntity Ship { get; set; }

        public int PassengerCount { get; set; }
        public int PassengerDifference { get; set; }

    }

}