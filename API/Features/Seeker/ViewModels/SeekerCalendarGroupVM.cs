using System.Collections.Generic;

namespace API.Features.Seeker {

    public class SeekerCalendarGroupVM {

        public string Date { get; set; }
        public IEnumerable<DestinationCalendarVM> Destinations { get; set; }

    }

}