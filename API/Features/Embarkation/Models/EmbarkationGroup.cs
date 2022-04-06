using System.Collections.Generic;
using API.Features.Drivers;
using API.Features.Reservations;

namespace API.Features.Embarkation {

    public class EmbarkationMainResult<T> {

        public int TotalPersons { get; set; }
        public int MissingNames { get; set; }
        public int Passengers { get; set; }
        public int Boarded { get; set; }
        public int Remaining { get; set; }

        public List<Reservation> Embarkation { get; set; }

    }

}