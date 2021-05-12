using System.Collections.Generic;

namespace CorfuCruises {

    public class ManifestViewModel {
 
        public string Date { get; set; }
        public string Ship { get; set; }
        public string ShipRoute { get; set; }
        public List<Passenger> Passengers { get; set; }

    }

}