using System.Collections.Generic;

namespace CorfuCruises.Manifest {

    public class ManifestResource {

        public string Date { get; set; }
        public string Ship { get; set; }
        public string Route { get; set; }

        public IEnumerable<PassengerResource> Passengers { get; set; }

    }

}