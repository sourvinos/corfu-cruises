namespace API.IntegrationTests.ShipRoutes {

    public class TestShipRoute {

        public string UserId { get; set; }
        public string FeatureUrl { get; set; }

        public int Id { get; set; }
        public string Description { get; set; }
        public string FromPort { get; set; }
        public string FromTime { get; set; }
        public string ViaPort { get; set; }
        public string ViaTime { get; set; }
        public string ToPort { get; set; }
        public string ToTime { get; set; }
        public bool IsActive { get; set; }

    }

}