using System.Collections.Generic;

namespace API.Features.Reservations {

    public class ReservationResource {

        public string Date { get; set; }

        public IEnumerable<DestinationResource> Destinations { get; set; }

    }

}