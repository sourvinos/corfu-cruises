using System.Collections.Generic;

namespace API.Features.Embarkation {

    public class EmbarkationFinalVM {

        public string RefNo { get; set; }
        public string TicketNo { get; set; }
        public string Remarks { get; set; }
        public string CustomerDescription { get; set; }
        public string DestinationDescription { get; set; }
        public string DriverDescription { get; set; }
        public string PortDescription { get; set; }
        public string ShipDescription { get; set; }
        public int TotalPersons { get; set; }
        public int EmbarkedPassengers { get; set; }
        public string EmbarkationStatus { get; set; }

        public int[] PassengerIds { get; set; }

        public List<EmbarkationFinalPassengerVM> Passengers { get; set; }

    }

}