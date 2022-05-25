using System.Collections.Generic;

namespace API.Features.Embarkation {

    public class EmbarkationGroupVM<T> {

        public int TotalPersons { get; set; }
        public int BoardedPassengers { get; set; }
        public int Remaining { get; set; }

        public IEnumerable<EmbarkationVM> Embarkation { get; set; }

    }

}