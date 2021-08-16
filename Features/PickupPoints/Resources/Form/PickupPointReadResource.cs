namespace BlueWaterCruises.Features.PickupPoints {

    public class PickupPointReadResource {

        public int Id { get; set; }
        public string RouteAbbreviation { get; set; }
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Coordinates { get; set; }
        public bool IsActive { get; set; }
    }

}