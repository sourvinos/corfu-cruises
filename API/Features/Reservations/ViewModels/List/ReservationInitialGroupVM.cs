using System.Collections.Generic;

namespace API.Features.Reservations {

    public class ReservationInitialGroupVM<T> {

        public int Persons { get; set; }
        
        public IEnumerable<Reservation> Reservations { get; set; }

    }

}