using System.Collections.Generic;

namespace API.Features.Totals {

    public class TotalsPortDTO {

        public string Port { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalPassengers { get; set; }
        public IEnumerable<HasTransferGroupDTO> HasTransferGroup { get; set; }

    }

    public class HasTransferGroupDTO {

        public bool HasTransfer { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalPassengers { get; set; }

    }

}