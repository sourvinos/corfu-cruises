using System;
using System.Collections.Generic;

namespace CorfuCruises {

    public class BookingSaveResource {

        // PK
        public int BookingId { get; set; }

        // Fields
        public DateTime Date { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string Remarks { get; set; }

        // FK
        public int DestinationId { get; set; }
        public int CustomerId { get; set; }
        public int DriverId { get; set; }
        public int PickupPointId { get; set; }
        public int ShipId { get; set; }
        public int PortId { get; set; }
        public string UserId { get; set; }

        // Details
        public List<BookingDetailSaveResource> Details { get; set; }

    }

}