using System.Collections.Generic;
using ShipCruises.Features.Reservations;

namespace ShipCruises.Features.Manifest {

    public class ManifestViewModel {

        public string Date { get; set; }
        public ShipResource Ship { get; set; }
        public Port Port { get; set; }

        public List<Passenger> Passengers { get; set; }

    }

}