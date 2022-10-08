using System.Collections.Generic;

namespace API.Features.Schedules {

    public class AvailabilityCalendarGroupVM {

        public string Date { get; set; }
        public IEnumerable<DestinationCalendarVM> Destinations { get; set; }

    }

}