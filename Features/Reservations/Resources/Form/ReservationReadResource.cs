using System;

namespace ShipCruises.Features.Reservations {

    public class ReservationReadResource {

        public Guid ReservationId { get; set; }

        public string Date { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }

        public CustomerResource Customer { get; set; }
        public DestinationResource Destination { get; set; }
        public DriverResource Driver { get; set; }
        public PickupPointResource PickupPoint { get; set; }
        public ShipResource Ship { get; set; }

        public UserResource User { get; set; }

    }

}