using System.Collections.Generic;

namespace CorfuCruises {

    public class ShipResource {

        public int ShipId { get; set; }
        public string Description { get; set; }
        public string Manager { get; set; }
        public string ManagerInGreece { get; set; }
        public string Agent { get; set; }

        public IEnumerable<DataEntryPerson> DataEntryPersons { get; set; }

    }

}