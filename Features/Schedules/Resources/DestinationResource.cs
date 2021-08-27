using System.Collections.Generic;

namespace BlueWaterCruises.Features.Schedules {

    public class DestinationResource {

        public int Id { get; set; }
        public string Description { get; set; }
        
        public IEnumerable<PortResource> Ports { get; set; }

    }

}