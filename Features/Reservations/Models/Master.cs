using System;
using System.Collections.Generic;

namespace CorfuCruises {

    public class Master {

        // public Guid ReservationId { get; set; }
        // public string Date { get; set; }
        // public string Remarks { get; set; }
        public IEnumerable<Reservation> Reservations { get; set; }

        public IEnumerable<Detail> Detail { get; set; }

    }

}