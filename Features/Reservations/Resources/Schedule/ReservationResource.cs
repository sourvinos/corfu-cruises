using System.Collections.Generic;

namespace BlueWaterCruises.Features.Reservations {

    public class ReservationResource {

        public string Date { get; set; }

        public IEnumerable<DestinationResource> Destinations { get; set; }

    }

}