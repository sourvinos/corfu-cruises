using System.Collections.Generic;

namespace BlueWaterCruises.Features.Reservations {

    public class DestinationResource : SimpleResource {

        public IEnumerable<PortResource> Ports { get; set; }

    }

}