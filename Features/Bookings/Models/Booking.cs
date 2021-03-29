using System;
using System.Collections.Generic;

namespace CorfuCruises {

    public class Booking {

        // PK
        public int BookingId { get; set; }

        // Fields
        public DateTime Date { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string Remarks { get; set; }

        // FK
        public int DestinationId { get; set; }
        public int CustomerId { get; set; }
        public int DriverId { get; set; }
        public int PickupPointId { get; set; }
        public int PortId { get; set; }
        public int ShipId { get; set; }
        public string UserId { get; set; }
        public string ImageUri { get; set; }

        // Navigation
        public Customer Customer { get; set; }
        public Destination Destination { get; set; }
        public Driver Driver { get; set; }
        public PickupPoint PickupPoint { get; set; }
        public Port Port { get; set; }
        public Ship Ship { get; set; }

        // Details
        public List<BookingDetail> Details { get; set; }

    }

}