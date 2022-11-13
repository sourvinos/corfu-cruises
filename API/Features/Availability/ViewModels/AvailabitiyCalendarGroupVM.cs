using System.Collections.Generic;

namespace API.Features.Availability {

    public class AvailabilityCalendarGroupVM {

        public string Date { get; set; }
        public IEnumerable<DestinationCalendarVM> Destinations { get; set; }

    }

}