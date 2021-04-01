using System.Collections.Generic;

namespace CorfuCruises {

    public class ReservationGroupReadResource<T> {

        public int Persons { get; set; }
        public IEnumerable<ReservationReadResource> Reservations { get; set; }
        public IEnumerable<TotalPersonsPerCustomer> PersonsPerCustomer { get; set; }
        public IEnumerable<TotalPersonsPerDestination> PersonsPerDestination { get; set; }
        public IEnumerable<TotalPersonsPerRoute> PersonsPerRoute { get; set; }
        public IEnumerable<TotalPersonsPerDriver> PersonsPerDriver { get; set; }
        public IEnumerable<TotalPersonsPerPort> PersonsPerPort { get; set; }
        public IEnumerable<TotalPersonsPerShip> PersonsPerShip { get; set; }

    }

}