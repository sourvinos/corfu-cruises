using System;

namespace CorfuCruises {

    public class InvoiceReadResource {

        public Guid ReservationId { get; set; }
        public string Date { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }

        public CustomerResource Customer { get; set; }
        public DestinationResource Destination { get; set; }
        public ShipResource Ship { get; set; }

    }

}