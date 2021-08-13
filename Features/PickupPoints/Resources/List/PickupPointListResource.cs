namespace ShipCruises.Features.PickupPoints {

    public class PickupPointListResource {

        public int Id { get; set; }
        public string RouteAbbreviation { get; set; }
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public bool IsActive { get; set; }

    }

}