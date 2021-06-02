using System.Collections.Generic;

namespace CorfuCruises.Manifest {

    public class ManifestResource {

        public string Date { get; set; }

        public ShipReadResource ShipReadResource { get; set; }

        public IEnumerable<PassengerResource> Passengers { get; set; }

    }

}