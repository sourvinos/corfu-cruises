using System.Collections.Generic;

namespace BlueWaterCruises.Features.Schedules {

    public class DestinationResource {

        public int Id { get; set; }
        public string Description { get; set; }
        public int PassengerCount { get; set; }
        public int AvailableSeats { get; set; }
        public IEnumerable<PortResource> Ports { get; set; }

    }

}