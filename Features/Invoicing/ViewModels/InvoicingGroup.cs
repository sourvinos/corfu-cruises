using System.Collections.Generic;

namespace CorfuCruises {

    public class InvoicingGroup {

        public bool IsTransfer { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }

        public IEnumerable<Reservation> Reservations { get; set; }

    }

}