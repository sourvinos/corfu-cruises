using System;
using System.Collections.Generic;

namespace BlueWaterCruises.Features.Reservations {

    public class MainResult {

        public DateTime Date { get; set; }
        public int DestinationId { get; set; }
        public IEnumerable<PortPersons> PortPersons { get; set; }

    }

}