using System.Collections.Generic;

namespace API.Features.Schedules {

    public class ScheduleReservationGroup {

        public string Date { get; set; }
        public IEnumerable<DestinationResource> Destinations { get; set; }

    }

}