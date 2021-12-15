using System.Collections.Generic;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Routes {

    public class Route : SimpleResource {

        public int PortId { get; set; }
        public string Abbreviation { get; set; }
        public bool IsTransfer { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public Port Port { get; set; }
        public List<PickupPoint> PickupPoints { get; set; }

        public AppUser User { get; set; }

    }

}