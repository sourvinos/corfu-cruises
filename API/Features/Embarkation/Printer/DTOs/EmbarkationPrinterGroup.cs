using System.Collections.Generic;
using API.Features.Reservations;

namespace API.Features.Embarkation.Printer {

    public class EmbarkationPrinterGroup<T> {

        public string Date { get; set; }
        public string Destination { get; set; }
        public string Port { get; set; }
        public string Ship { get; set; }
        public int PassengerCount { get; set; }
        public int PassengerCountWithNames { get; set; }
        public int PassengerCountWithNoNames { get; set; }

        public List<Reservation> Embarkation { get; set; }

    }

}