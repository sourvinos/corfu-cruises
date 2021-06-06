using System;

namespace CorfuCruises {

    public class InvoiceReservationViewModel {

        public Guid ReservationId { get; set; }

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }
        public string Remarks { get; set; }
        public bool IsTransfer { get; set; }
        public string DestinationDescription { get; set; }
        public string ShipDescription { get; set; }

    }

}