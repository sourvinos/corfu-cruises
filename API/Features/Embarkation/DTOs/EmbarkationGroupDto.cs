using System.Collections.Generic;
using API.Features.Reservations;

namespace API.Features.Embarkation {

    public class EmbarkationGroupDto<T> {

        public int TotalPersons { get; set; }
        public int BoardedPassengers { get; set; }
        public int RemainingCount { get; set; }

        public List<Reservation> Reservations { get; set; }

    }

}