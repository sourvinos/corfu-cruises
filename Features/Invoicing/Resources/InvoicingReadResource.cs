using System.Collections.Generic;

namespace CorfuCruises {

    public class InvoicingReadResource {

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public bool IsTransfer { get; set; }

        public IEnumerable<InvoicingReservationViewModel> Reservations { get; set; }

    }

}