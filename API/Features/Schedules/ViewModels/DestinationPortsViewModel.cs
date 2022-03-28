using System.Collections.Generic;

namespace API.Features.Schedules {

    public class DestinationPortsViewModel {

        public int Id { get; set; }
        public string Description { get; set; }
        public int PassengerCount { get; set; }
        public int AvailableSeats { get; set; }
        public IEnumerable<PortViewModel> Ports { get; set; }

    }

}