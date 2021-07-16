using System.Collections.Generic;

namespace ShipCruises.Manifest {

    public class ManifestViewModel {

        public string Date { get; set; }
        public string Port { get; set; }

        public Ship Ship { get; set; }

        public List<Passenger> Passengers { get; set; }

    }

}