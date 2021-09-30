using System.Collections.Generic;

namespace BlueWaterCruises.Features.Schedules {

    public class DestinationResource : SimpleResource {

        public string Abbreviation { get; set; }
        public int Empty { get; set; }
        public IEnumerable<PortResource> Ports { get; set; }

    }

}