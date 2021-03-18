using System;

namespace CorfuCruises {

    public class BookingDetailSaveResource {

        // PK
        public int Id { get; set; }

        // Joined Key
        public int BookingId { get; set; }

        // Fields
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public DateTime DOB { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string Remarks { get; set; }
        public string SpecialCare { get; set; }
        public bool IsCheckedIn { get; set; }

        // FK
        public int NationalityId { get; set; }
        public int OccupantId { get; set; }

    }

}