using System.Collections.Generic;

namespace API.Features.Reservations {

    public class ReservationGroupVM<T> {

        public int Persons { get; set; }
 
        public IEnumerable<ReservationListVM> Reservations { get; set; }

    }

}