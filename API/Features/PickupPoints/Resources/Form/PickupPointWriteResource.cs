namespace API.Features.PickupPoints {

    public class PickupPointWriteResource {

        public int Id { get; set; }
        public int RouteId { get; set; }
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string Coordinates { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}