using System.Collections.Generic;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Infrastructure.Identity;

namespace BlueWaterCruises.Features.Routes {

    public class Route {

        // PK
        public int Id { get; set; }
        // Fields
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool IsTransfer { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public int PortId { get; set; }
        public string UserId { get; set; }
        // Navigation
        public Port Port { get; set; }
        public UserExtended User { get; set; }
        public List<PickupPoint> PickupPoints { get; set; }

    }

}