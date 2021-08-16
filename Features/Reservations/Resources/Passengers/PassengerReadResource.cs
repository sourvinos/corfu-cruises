using System;

namespace BlueWaterCruises.Features.Reservations {

    public class PassengerReadResource {

        public int Id { get; set; }

        public Guid ReservationId { get; set; }

        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public string Remarks { get; set; }
        public string SpecialCare { get; set; }
        public bool IsCheckedIn { get; set; }

        public NationalityResource Nationality { get; set; }
        public GenderResource Gender { get; set; }

    }

}