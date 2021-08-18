using BlueWaterCruises.Features.Ports;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointDropdownResource {

        public int Id { get; set; }
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }

        public PortDropdownResource Port { get; set; }

    }

}