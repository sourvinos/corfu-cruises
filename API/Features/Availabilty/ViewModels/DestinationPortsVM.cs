using System.Collections.Generic;

namespace API.Features.Availability {

    public class DestinationPortsVM {

        public int Id { get; set; }
        public string Description { get; set; }
        public int PassengerCount { get; set; }
        public int AvailableSeats { get; set; }
        public IEnumerable<PortVM> Ports { get; set; }

    }

}