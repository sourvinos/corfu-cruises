using System.Collections.Generic;

namespace API.Features.Ledger {

    public class LedgerPortVM {

        public string Port { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalPassengers { get; set; }
        public IEnumerable<LedgerPortGroupVM> HasTransferGroup { get; set; } // Level 3

    }

}