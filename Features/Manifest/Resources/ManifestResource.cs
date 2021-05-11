using System.Collections.Generic;

namespace CorfuCruises {

    public class ManifestResource {

        public string Date { get; set; }
        public string ShipDescription { get; set; }

        public List<PassengerViewModel> Passengers { get; set; }

    }

}