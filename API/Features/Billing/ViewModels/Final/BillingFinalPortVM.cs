using System.Collections.Generic;

namespace API.Features.Billing {

    public class BillingFinalPortVM {

        // Level 2a of 3

        public string Port { get; set; }
        public IEnumerable<BillingFinalHasTransferGroupVM> HasTransferGroup { get; set; } // Level 3 of 3
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalPassengers { get; set; }

    }

}