using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CorfuCruises {

    public class SaveDetailResource {

        public int Id { get; set; }
        public int MasterId { get; set; }
        public int OccupantId { get; set; }
        public int NationalityId { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Phones { get; set; }
        public string DOB { get; set; }
        public string Remarks { get; set; }
        public string SpecialCare { get; set; }
        public bool IsCheckedIn { get; set; }

    }

}