using System.Collections.Generic;

namespace API.Features.Manifest {

    public class ManifestFinalVM {

        // Level 1 of 3

        public string Date { get; set; }
        public string Destination { get; set; }
        public ManifestFinalShipVM Ship { get; set; } // Level 2a of 3
        public ManifestFinalShipRouteVM ShipRoute { get; set; } // Level 2b of 3
        public List<ManifestFinalPassengerVM> Passengers { get; set; } // Level 2c of 3

    }

}