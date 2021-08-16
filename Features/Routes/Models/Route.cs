using BlueWaterCruises.Features.Ports;

namespace BlueWaterCruises.Features.Routes {

    public class Route {

        public int Id { get; set; }
        public int PortId { get; set; }
        public string Abbreviation { get; set; }
        public string Description { get; set; }
        public bool IsTransfer{get;set;}
        public bool IsActive { get; set; }
        public string UserId { get; set; }

        public Port Port { get; set; }

    }

}