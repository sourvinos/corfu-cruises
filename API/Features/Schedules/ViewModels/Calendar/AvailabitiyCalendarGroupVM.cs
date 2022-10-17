using System.Collections.Generic;

namespace API.Features.Schedules {

    public class AvailabilityCalendarGroupVM {

        // Level 1 of 3

        public string Date { get; set; }
        public IEnumerable<DestinationCalendarVM> Destinations { get; set; } // Level 2 of 3

    }

}