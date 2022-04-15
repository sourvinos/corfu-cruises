using System.Collections.Generic;

namespace API.Features.Invoicing {

    public class InvoicingPortVM {

        public string Description { get; set; }
        public IEnumerable<HasTransferGroupVM> HasTransferGroup { get; set; }
        public int TotalPersons { get; set; }

    }

    public class HasTransferGroupVM {

        public bool HasTransfer { get; set; }
        public int TotalPersons { get; set; }

    }

}