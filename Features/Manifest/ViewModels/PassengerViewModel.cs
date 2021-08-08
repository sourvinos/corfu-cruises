using System;

namespace ShipCruises {

    public class ManifestPassenger {

        public int Id { get; set; }

        public Guid ReservationId { get; set; }

        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public string Remarks { get; set; }
        public string SpecialCare { get; set; }
        public bool IsCheckedIn { get; set; }

        public int NationalityId { get; set; }
        public int OccupantId { get; set; }
        public int GenderId { get; set; }

        public Nationality Nationality { get; set; }
        public Occupant Occupant { get; set; }
        public Gender Gender { get; set; }

     }

}