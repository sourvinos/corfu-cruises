using System.Collections.Generic;

namespace BlueWaterCruises.Features.Schedules {

    public class DestinationResource : SimpleResource {

        public int PassengerCount { get; set; }
        public int AvailableSeats { get; set; }
        public IEnumerable<PortResource> Ports { get; set; }

    }

}