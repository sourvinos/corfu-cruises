using System.Collections.Generic;

namespace API.Features.Availability {

    public class AvailabilityVM {

        public string Date { get; set; }
        public IEnumerable<DestinationPortsVM> Destinations { get; set; }

    }

}