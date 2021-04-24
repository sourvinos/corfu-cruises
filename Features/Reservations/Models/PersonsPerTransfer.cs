using System.Collections.Generic;

namespace CorfuCruises {

    public class PersonsPerTransfer {

        public CustomerResource Customer { get; set; }
        public DestinationResource Destination { get; set; }
        public bool IsTransfer { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }

    }

}