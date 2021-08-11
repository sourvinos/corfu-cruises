using System;

namespace ShipCruises {

    public class ReservationReadResource {

        public Guid ReservationId { get; set; }

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }

        public string CustomerDescription { get; set; }
        public string DestinationAbbreviation { get; set; }
        public string DestinationDescription { get; set; }
        public string DriverDescription { get; set; }
        public string PickupPointDescription { get; set; }
        public string RouteAbbreviation { get; set; }
        public string PortDescription { get; set; }
        public string ShipDescription { get; set; }
        public string User { get; set; }

    }

}