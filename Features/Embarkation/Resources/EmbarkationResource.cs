using System.Collections.Generic;

namespace ShipCruises {

    public class EmbarkationResource {

        public string TicketNo { get; set; }
        public string Remarks { get; set; }
        public string Customer { get; set; }
        public string Driver { get; set; }
        public int TotalPersons { get; set; }

        public List<EmbarkationPassengerResource> Passengers { get; set; }

    }

}