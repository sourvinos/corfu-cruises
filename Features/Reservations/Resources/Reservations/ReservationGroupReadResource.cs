using System.Collections.Generic;

namespace CorfuCruises {

    public class ReservationGroupReadResource<T> {

        public int Persons { get; set; }
        public IEnumerable<ReservationReadResource> Reservations { get; set; }
        public IEnumerable<PersonsPerCustomer> PersonsPerCustomer { get; set; }
        public IEnumerable<PersonsPerDestination> PersonsPerDestination { get; set; }
        public IEnumerable<PersonsPerRoute> PersonsPerRoute { get; set; }
        public IEnumerable<PersonsPerDriver> PersonsPerDriver { get; set; }
        public IEnumerable<PersonsPerPort> PersonsPerPort { get; set; }
        public IEnumerable<PersonsPerShip> PersonsPerShip { get; set; }

    }

}