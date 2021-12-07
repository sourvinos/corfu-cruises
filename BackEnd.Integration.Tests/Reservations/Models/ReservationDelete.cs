using System;

namespace BackEnd.IntegrationTests {

    public class ReservationDelete {

        public string Username { get; set; }
        public string Password { get; set; }
        public string UserId { get; set; }
        public int ExpectedError { get; set; }
        public Guid ReservationId { get; set; }

    }

}