namespace BackEnd.IntegrationTests {

    public class Reservation : ReservationBase {

        public string Date { get; set; }
        public int DestinationId { get; set; }
        public int CustomerId { get; set; }
        public int PortId { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public string TicketNo { get; set; }

    }

}