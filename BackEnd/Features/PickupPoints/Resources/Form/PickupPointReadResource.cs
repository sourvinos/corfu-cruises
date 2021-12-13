using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointReadResource : SimpleResource {

        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Coordinates { get; set; }
        public bool IsActive { get; set; }

        public RouteDropdownResource Route { get; set; }

    }

}