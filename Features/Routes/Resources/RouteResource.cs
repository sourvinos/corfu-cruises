namespace ShipCruises.Features.Routes {

    public class RouteResource {

        public int Id { get; set; }
        public string Abbreviation { get; set; }
        public string Description { get; set; }
        public bool IsTransfer { get; set; }
        public PortResource Port { get; set; }

    }

}