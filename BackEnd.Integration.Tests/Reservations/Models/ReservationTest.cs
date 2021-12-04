using System;

namespace BackEnd.IntegrationTests {

    public class ReservationTest {

        public string Username { get; set; }
        public string Password { get; set; }
        public string UserId { get; set; }
        public int ExpectedError { get; set; }
        public Guid ReservationId { get; set; }
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