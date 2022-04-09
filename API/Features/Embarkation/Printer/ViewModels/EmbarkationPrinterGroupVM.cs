using System.Collections.Generic;

namespace API.Features.Embarkation.Printer {

    public class EmbarkationPrinterGroupVM<T> {

        public string Logo { get; set; }
        public int PassengerCount { get; set; }
        public int PassengerCountWithNames { get; set; }
        public int PassengerCountWithNoNames { get; set; }

        public IEnumerable<EmbarkationPrinterVM> Embarkation { get; set; }

    }

}