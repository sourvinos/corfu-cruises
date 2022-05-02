using System.Collections.Generic;

namespace API.Features.Invoicing.Display {

    public class InvoicingDisplayPortVM {

        public string Port { get; set; }
        public IEnumerable<HasTransferGroupVM> HasTransferGroup { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalPassengers { get; set; }

    }

    public class HasTransferGroupVM {

        public bool HasTransfer { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalPassengers { get; set; }

    }

}