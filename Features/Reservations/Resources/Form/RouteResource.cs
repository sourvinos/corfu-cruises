namespace BlueWaterCruises.Features.Reservations {

    public class RouteResource {

        public int Id { get; set; }
        public string Abbreviation { get; set; }
        public string Description { get; set; }
        public int PortId { get; set; }

        public PortResource Port { get; set; }

    }

}