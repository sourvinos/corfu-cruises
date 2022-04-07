using System.Collections.Generic;
using API.Features.Reservations;

namespace API.Features.Embarkation {

    public class EmbarkationMainResult<T> {

        public int PassengerCount { get; set; }
        public int PassengerCountWithNames { get; set; }
        public int BoardedCount { get; set; }
        public int RemainingCount { get; set; }
        public int PassengerCountWithNoNames { get; set; }

        public List<Reservation> Embarkation { get; set; }

    }

}