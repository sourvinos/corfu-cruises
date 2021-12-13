using System.Collections.Generic;
using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Reservations {

    public class DestinationResource : SimpleResource {

        public IEnumerable<PortResource> Ports { get; set; }

    }

}