namespace BlueWaterCruises.Features.Destinations {

    public class Destination : SimpleResource {

        public string Abbreviation { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}