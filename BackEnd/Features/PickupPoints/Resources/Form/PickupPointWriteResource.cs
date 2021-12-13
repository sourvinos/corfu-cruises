using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointWriteResource : SimpleResource {

        public int RouteId { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Coordinates { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}