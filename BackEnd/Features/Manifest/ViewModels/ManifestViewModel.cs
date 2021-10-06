using System.Collections.Generic;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Features.Reservations;

namespace BlueWaterCruises.Features.Manifest {

    public class ManifestViewModel {

        public string Date { get; set; }
        public ShipResource Ship { get; set; }
        public Port Port { get; set; }

        public List<Passenger> Passengers { get; set; }

    }

}