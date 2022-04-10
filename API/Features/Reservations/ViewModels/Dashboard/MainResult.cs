using System.Collections.Generic;

namespace API.Features.Reservations {

    public class MainResult<T> {

        public int Persons { get; set; }
        public IEnumerable<Reservation> Reservations { get; set; }

    }

}