using System.Collections.Generic;

namespace API.Features.Ledger {

    public class LedgerFinalPortVM {

        // Level 2a of 3

        public string Port { get; set; }
        public IEnumerable<LedgerFinalHasTransferGroupVM> HasTransferGroup { get; set; } // Level 3 of 3
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalPassengers { get; set; }

    }

}