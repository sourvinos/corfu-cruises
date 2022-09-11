using System.Collections.Generic;

namespace API.Features.Reservations {

    public class ReservationGroup<T> {

        public int Persons { get; set; }
        public IEnumerable<Reservation> Reservations { get; set; }

    }

}