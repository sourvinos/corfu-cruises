using System.Collections.Generic;

namespace API.Features.Embarkation {

    // Level 2 of 3

    public class EmbarkationFinalVM {

        public string RefNo { get; set; }
        public string TicketNo { get; set; }
        public string Remarks { get; set; }
        public string Customer { get; set; }
        public string Destination { get; set; }
        public string Driver { get; set; }
        public string Port { get; set; }
        public string Ship { get; set; }
        public int TotalPersons { get; set; }
        public int EmbarkedPassengers { get; set; }
        public string EmbarkationStatus { get; set; }

        public int[] PassengerIds { get; set; }

        public List<EmbarkationFinalPassengerVM> Passengers { get; set; } // Level 3 of 3

    }

}