namespace ShipCruises.Features.Reservations {

    public class PickupPointResource {

        public int Id { get; set; }
        public string Description { get; set; }

        public PortResource Port { get; set; }

    }

}