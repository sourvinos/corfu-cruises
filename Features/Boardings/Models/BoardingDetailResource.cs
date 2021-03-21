namespace CorfuCruises {

    public class BookingDetailResource {

        // PK
        public int Id { get; set; }

        // Joined Key
        public int BookingId { get; set; }

        // Fields
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public bool IsCheckedIn { get; set; }

    }

}