using System.Collections.Generic;

namespace CorfuCruises {

    public class InvoiceIntermediateViewModel {

        public string Date { get; set; }
        public Customer Customer { get; set; }

        public List<Reservation> Reservations { get; set; }
        public List<IsTransferGroupViewModel> IsTransferGroup { get; set; }

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }

    }

}