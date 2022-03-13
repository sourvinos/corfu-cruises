using System;

namespace API.Features.Invoicing {

    public class InvoiceReservationViewModel {

        public Guid ReservationId { get; set; }

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string TicketNo { get; set; }
        public string Remarks { get; set; }
        public bool HasTransfer { get; set; }
        public string DestinationDescription { get; set; }
        public string ShipDescription { get; set; } = "EMPTY";

    }

}