using System;

namespace CorfuCruises {

    public class PassengerWriteResource {

        public int Id { get; set; }
        public int ReservationId { get; set; }
        public int OccupantId { get; set; }
        public int NationalityId { get; set; }
        public int GenderId { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public DateTime DOB { get; set; }
        public string SpecialCare { get; set; }
        public string Remarks { get; set; }
        public bool IsCheckedIn { get; set; }

    }

}