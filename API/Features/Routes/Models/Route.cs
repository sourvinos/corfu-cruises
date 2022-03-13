using System.Collections.Generic;
using API.Features.PickupPoints;
using API.Features.Ports;
using API.Infrastructure.Identity;

namespace API.Features.Routes {

    public class Route {

        // PK
        public int Id { get; set; }
        // FKs
        public int PortId { get; set; }
        // Fields
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool HasTransfer { get; set; }
        public bool IsActive { get; set; }
        // FKs
        public string UserId { get; set; }
        // Navigation
        public Port Port { get; set; }
        public UserExtended User { get; set; }
        public List<PickupPoint> PickupPoints { get; set; }

    }

}