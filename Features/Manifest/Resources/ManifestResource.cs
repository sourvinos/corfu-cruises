using System.Collections.Generic;

namespace CorfuCruises {

    public class ManifestResource {

        public string Date { get; set; }
        public string Ship { get; set; }
        public string Destination { get; set; }

        public List<PassengerViewModel> Passengers { get; set; }

    }

}