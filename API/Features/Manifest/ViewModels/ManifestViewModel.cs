using System.Collections.Generic;
using API.Features.Ports;
using API.Features.Reservations;

namespace API.Features.Manifest {

    public class ManifestViewModel {

        public string Date { get; set; }
        public ShipResource Ship { get; set; }
        public Port Port { get; set; }

        public List<Passenger> Passengers { get; set; }

    }

}