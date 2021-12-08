namespace BackEnd.IntegrationTests {

    public class ReservationBase {

        public string Username { get; set; }
        public string Password { get; set; }
        public string UserId { get; set; }
        public string ReservationId { get; set; }
        public int ExpectedResponseCode { get; set; }

    }

}