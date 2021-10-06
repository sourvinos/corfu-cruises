using System.Collections.Generic;

namespace BlueWaterCruises.Features.Schedules {

    public class ScheduleReservationGroup {

        public string Date { get; set; }
        public IEnumerable<DestinationResource> Destinations { get; set; }

    }

}