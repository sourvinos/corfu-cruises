using System;

namespace API.Features.Invoicing {

    public class InvoicingReservationVM {

        public string Date { get; set; }
        public string RefNo { get; set; }
        public Guid ReservationId { get; set; }
        public string Destination { get; set; }
        public string Port { get; set; }
        public string Ship { get; set; }
        public string TicketNo { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int EmbarkedPassengers { get; set; }
        public int TotalNoShow { get; set; }
        public string Remarks { get; set; }
        public bool HasTransfer { get; set; }

    }

}