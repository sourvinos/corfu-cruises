using System.Collections.Generic;

namespace API.Features.Reservations {

    public class ReservationFinalGroupVM {

        // Level 1 of 2

        public int Persons { get; set; }

        public IEnumerable<ReservationFinalListVM> Reservations { get; set; } // Level 2

    }

}