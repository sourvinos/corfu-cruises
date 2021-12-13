namespace BackEnd.IntegrationTests.Reservations {

    public class ReservationBase : Login {

        public string ReservationId { get; set; }
        public int ExpectedResponseCode { get; set; }
        public string FeatureUrl { get; set; }

    }

}