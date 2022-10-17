using System.Collections.Generic;

namespace API.Features.Billing {

    public class BillingInitialPortVM {

        // Level 2a

        public string Port { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalPassengers { get; set; }
        public IEnumerable<BillingInitialPortGroupVM> HasTransferGroup { get; set; } // Level 3

    }

}