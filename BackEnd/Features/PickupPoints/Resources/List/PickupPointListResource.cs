using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointListResource : SimpleResource {

        public string RouteAbbreviation { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public bool IsActive { get; set; }

    }

}