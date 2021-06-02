using System;
using System.Collections.Generic;

namespace CorfuCruises {

    public class ReservationReadResource {

        public Guid ReservationId { get; set; }
        public string Date { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string Remarks { get; set; }
        public string UserId { get; set; }

        public List<PassengerReadResource> Passengers { get; set; }

        public CustomerResource Customer { get; set; }
        public DestinationResource Destination { get; set; }
        public PickupPointResource PickupPoint { get; set; }
        public DriverResource Driver { get; set; }
        public ShipReadResource Ship { get; set; }

    }

}