using System;

namespace CorfuCruises.Manifest {

    public class PassengerResource {

        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string DOB { get; set; }
        public string Remarks { get; set; }
        public string SpecialCare { get; set; }

        public string NationalityDescription { get; set; }
        public string GenderDescription { get; set; }
        public string OccupantDescription { get; set; }

    }

}