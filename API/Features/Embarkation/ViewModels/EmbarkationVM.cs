using System.Collections.Generic;

namespace API.Features.Embarkation {

    public class EmbarkationVM {

        public string RefNo { get; set; }
        public string TicketNo { get; set; }
        public string Remarks { get; set; }
        public string Customer { get; set; }
        public string Destination { get; set; }
        public string Driver { get; set; }
        public string Ship { get; set; }
        public int TotalPersons { get; set; }
        public int EmbarkedPassengers { get; set; }
        public string EmbarkationStatus { get; set; }

        public int[] PassengerIds { get; set; }

        public List<EmbarkationPassengerVM> Passengers { get; set; }

    }

}