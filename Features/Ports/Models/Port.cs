namespace BlueWaterCruises.Features.Ports {

    public class Port : SimpleResource {

        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}