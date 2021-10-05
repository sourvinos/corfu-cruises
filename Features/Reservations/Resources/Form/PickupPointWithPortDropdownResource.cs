namespace BlueWaterCruises.Features.Reservations {

    public class PickupPointWithPortDropdownResource : SimpleResource {

        public string ExactPoint { get; set; }
        public string Time { get; set; }

        public SimpleResource Port { get; set; }

    }

}