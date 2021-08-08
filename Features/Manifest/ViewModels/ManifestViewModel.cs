using System.Collections.Generic;

namespace ShipCruises.Manifest {

    public class ManifestViewModel {

        public string Date { get; set; }
        public Ship Ship { get; set; }
        public Port Port { get; set; }

        public List<Passenger> Passengers { get; set; }

    }

}