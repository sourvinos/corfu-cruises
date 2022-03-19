using System.Collections.Generic;
using API.Features.Reservations;
using API.Features.Ships;

namespace API.Features.Manifest {

    public class ManifestViewModel {

        public string Date { get; set; }
        public Ship Ship { get; set; }

        public List<Passenger> Passengers { get; set; }

    }

}