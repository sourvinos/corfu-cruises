using System.Collections.Generic;

namespace API.Features.Embarkation {

    // Level 1 of 3

    public class EmbarkationFinalGroupVM {

        public int TotalPersons { get; set; }
        public int EmbarkedPassengers { get; set; }
        public int PendingPersons { get; set; }

        public IEnumerable<EmbarkationFinalVM> Reservations { get; set; } // Level 2 of 3

    }

}