using System.Collections.Generic;

namespace API.Features.Reservations {

    public class ReservationMappedGroupVM<T> {

        public int Persons { get; set; }
 
        public IEnumerable<ReservationMappedListVM> Reservations { get; set; }

    }

}