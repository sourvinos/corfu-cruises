using System;

namespace CorfuCruises {

    public class InvoicingReadResource {

        public Guid ReservationId { get; set; }
        public string Date { get; set; }
        public string CustomerDescription { get; set; }
        public string DestinationDescription { get; set; }
        public string ShipDescription { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }
        public bool IsTransfer { get; set; }
        public string Remarks { get; set; }

    }

}