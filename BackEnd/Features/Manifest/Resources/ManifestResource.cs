using System.Collections.Generic;

namespace BlueWaterCruises.Features.Manifest {

    public class ManifestResource {

        public string Date { get; set; }

        public ShipResource Ship { get; set; }

        public List<PassengerResource> Passengers { get; set; }

    }

}