using System.Collections.Generic;

namespace CorfuCruises {

    public class InvoiceViewModel {

        public string Date { get; set; }
        public string CustomerDescription { get; set; }

        public List<InvoiceReservationViewModel> Reservations { get; set; }
        public List<IsTransferGroupViewModel> IsTransferGroup { get; set; }

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }

    }

}