using System.Collections.Generic;

namespace API.Features.Embarkation {

    public class EmbarkationGroupVM<T> {

        public int PassengerCount { get; set; }
        public int PassengerCountWithNames { get; set; }
        public int BoardedCount { get; set; }
        public int RemainingCount { get; set; }
        public int PassengerCountWithNoNames { get; set; }

        public IEnumerable<EmbarkationVM> Embarkation { get; set; }

    }

}