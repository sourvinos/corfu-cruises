using System.Collections.Generic;

namespace API.Features.Manifest {

    public class ManifestVM {

        public string Date { get; set; }
        public string Destination { get; set; }
        public IEnumerable<PassengerVM> Passengers { get; set; }
        public IEnumerable<PassengerVM> Crew { get; set; }

    }

}