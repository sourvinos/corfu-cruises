using System.Collections.Generic;

namespace ShipCruises {

    public class InvoiceIntermediateViewModel {

        public string Date { get; set; }
        public Customer Customer { get; set; }

        public List<Reservation> Reservations { get; set; }
        public List<IsTransferGroupViewModel> IsTransferGroup { get; set; }

        public IsTransferGroupViewModel IsTransferGroupTotal { get; set; }

     }

}