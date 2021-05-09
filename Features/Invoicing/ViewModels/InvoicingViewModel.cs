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
        public bool IsTransfer { get; set; }
        public string Remarks { get; set; }

        public string Destination { get; set; }
        public string Customer { get; set; }
        public string PickupPoint { get; set; }
        public string Ship { get; set; }

    }

}