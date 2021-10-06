namespace BlueWaterCruises.Features.Ships {

    public class ShipRoute : SimpleResource {

        public string FromPort { get; set; }
        public string FromTime { get; set; }
        public string ViaPort { get; set; }
        public string ViaTime { get; set; }
        public string ToPort { get; set; }
        public string ToTime { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}