using BlueWaterCruises.Infrastructure.Classes;

namespace BlueWaterCruises.Features.Reservations {

    public class PickupPointWithPortDropdownResource {

        public int Id { get; set; }
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public SimpleResource Port { get; set; }

    }

}