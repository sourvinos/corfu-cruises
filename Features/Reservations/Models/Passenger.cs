using System;

namespace CorfuCruises {

    public class Passenger {

        // PK
        public int Id { get; set; }

        // Joined Key
        public int ReservationId { get; set; }

        // Fields
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public DateTime DOB { get; set; }
        public string Remarks { get; set; }
        public string SpecialCare { get; set; }
        public bool IsCheckedIn { get; set; }

        // FK
        public int NationalityId { get; set; }
        public int OccupantId { get; set; }
        public int GenderId{get;set;}

        public Nationality Nationality { get; set; }
        public Occupant Occupant { get; set; }
        public Gender Gender { get; set; }

    }

}