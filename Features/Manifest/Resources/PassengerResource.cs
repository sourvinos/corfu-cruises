using System;

namespace ShipCruises.Manifest {

    public class PassengerResource {

        public Guid ReservationId { get; set; }

        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string BirthDate { get; set; }
        public string Remarks { get; set; }
        public string SpecialCare { get; set; }
        public bool IsCheckedIn { get; set; }

        public string NationalityDescription { get; set; }
        public string GenderDescription { get; set; }
        public string OccupantDescription { get; set; }

    }

}