using System.Collections.Generic;

namespace API.Features.Embarkation {

    public class EmbarkationGroupVM<T> {

        public int TotalPersons { get; set; }
        public int EmbarkedPassengers { get; set; }
        public int PendingPersons { get; set; }

        public IEnumerable<EmbarkationVM> Reservations { get; set; }

    }

}