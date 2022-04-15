using System.Collections.Generic;

namespace API.Features.Invoicing {

    public class InvoicingPortDTO {

        public string Description { get; set; }
        public IEnumerable<HasTransferGroupDTO> HasTransferGroup { get; set; }
        public int TotalPersons { get; set; }

    }

    public class HasTransferGroupDTO {

        public bool HasTransfer { get; set; }
        public int TotalPersons { get; set; }

    }

}