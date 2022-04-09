using System.Collections.Generic;
using API.Features.Reservations;

namespace API.Features.Embarkation.Printer {

    public class EmbarkationPrinterGroup<T> {

        public string Logo { get; set; }
        public int PassengerCount { get; set; }
        public int PassengerCountWithNames { get; set; }
        public int PassengerCountWithNoNames { get; set; }

        public List<Reservation> Embarkation { get; set; }

    }

}