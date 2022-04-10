using System.Collections.Generic;

namespace API.Features.Embarkation.Printer {

    public class EmbarkationPrinterGroupVM<T> {

        public string Date { get; set; }
        public string Destination { get; set; }
        public string Port { get; set; }
        public string Ship { get; set; }
        public int PassengerCount { get; set; }
        public int PassengerCountWithNames { get; set; }
        public int PassengerCountWithNoNames { get; set; }

        public IEnumerable<EmbarkationPrinterVM> Embarkation { get; set; }

    }

}