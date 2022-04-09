using System.Collections.Generic;

namespace API.Features.Embarkation.Display {

    public class EmbarkationDisplayGroupVM<T> {

        public int PassengerCount { get; set; }
        public int PassengerCountWithNames { get; set; }
        public int BoardedCount { get; set; }
        public int RemainingCount { get; set; }
        public int PassengerCountWithNoNames { get; set; }

        public IEnumerable<EmbarkationDisplayVM> Embarkation { get; set; }

    }

}