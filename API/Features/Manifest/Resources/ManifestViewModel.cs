using System.Collections.Generic;

namespace API.Features.Manifest {

    public class ManifestResource {

        public string Date { get; set; }

        public ManifestShipViewModel Ship { get; set; }

        public List<ManifestPassengerViewModel> Passengers { get; set; }

    }

}