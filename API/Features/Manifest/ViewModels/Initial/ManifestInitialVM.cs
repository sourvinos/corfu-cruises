using System.Collections.Generic;
using API.Features.Reservations;
using API.Features.ShipRoutes;
using API.Features.Ships;

namespace API.Features.Manifest {

    public class ManifestVMs {

        public string Date { get; set; }
        public string Destination { get; set; }
        public string Port { get; set; }
        public Ship Ship { get; set; }
        public ShipRoute ShipRoute { get; set; }
        public List<Passenger> Passengers { get; set; }

    }

}