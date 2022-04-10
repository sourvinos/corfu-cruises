using System.Collections.Generic;

namespace API.Features.Reservations {

    public class ReservationGroupResource<T> {

        public int Persons { get; set; }
        public IEnumerable<ReservationListResource> Reservations { get; set; }

    }

}