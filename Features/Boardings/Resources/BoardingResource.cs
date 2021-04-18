using System.Collections.Generic;

namespace CorfuCruises {

    public class BoardingResource {

        public string TicketNo { get; set; }
        public string Remarks { get; set; }
        public string Driver { get; set; }

        public List<BoardingPassengerResource> Passengers { get; set; }

    }

}