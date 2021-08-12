using System.Collections.Generic;

namespace ShipCruises.Features.Reservations {

    public class MainResult {

        public string Date { get; set; }
        public int DestinationId { get; set; }
        public IEnumerable<PortPersons> PortPersons { get; set; }

    }

}