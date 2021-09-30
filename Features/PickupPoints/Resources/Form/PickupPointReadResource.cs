using BlueWaterCruises.Features.Routes;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointReadResource : SimpleResource {

        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Coordinates { get; set; }
        public bool IsActive { get; set; }

        public SimpleResource Route { get; set; }

    }

}