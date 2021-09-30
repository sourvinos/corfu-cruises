using BlueWaterCruises.Features.Ports;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointDropdownResource : SimpleResource {

        public string ExactPoint { get; set; }
        public string Time { get; set; }

        public SimpleResource Port { get; set; }

    }

}