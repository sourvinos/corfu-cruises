namespace API.Features.PickupPoints {

    public class PickupPointReadDto {

        public int Id { get; set; }
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Coordinates { get; set; }
        public bool IsActive { get; set; }

        public CoachRouteDropdownVM CoachRoute { get; set; }

    }

}