using System.Collections.Generic;

namespace CorfuCruises {

    public class ShipResource {

        public int Id { get; set; }
        public string Description { get; set; }
        public string IMO { get; set; }
        public string Flag { get; set; }
        public string RegistryNo { get; set; }
        public string Manager { get; set; }
        public string ManagerInGreece { get; set; }
        public string Agent { get; set; }


        public ShipOwner ShipOwner { get; set; }

        public IEnumerable<DataEntryPerson> DataEntryPersons { get; set; }

    }

}