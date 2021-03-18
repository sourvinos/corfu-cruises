namespace CorfuCruises {

    public class BookingResource {

        public int BookingId { get; set; }
        public string Date { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string Remarks { get; set; }
        public string UserId { get; set; }
        public CustomerResource Customer { get; set; }
        public DestinationResource Destination { get; set; }
        public PickupPointResource PickupPoint { get; set; }
        public DriverResource Driver { get; set; }

    }

}