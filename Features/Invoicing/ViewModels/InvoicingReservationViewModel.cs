using System;

namespace CorfuCruises {

    public class InvoicingReservationViewModel {

        public string Date { get; set; }
        public Guid ReservationId { get; set; }
        public string TicketNo { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public CustomerResource Customer { get; set; }

    }

}