namespace API.Features.ShipRoutes {

    public class ShipRouteListResource {

        public int Id { get; set; }
        public string Description { get; set; }
        public string FromPort { get; set; }
        public string ViaPort { get; set; }
        public string ToPort { get; set; }
        public bool IsActive { get; set; }

    }

}