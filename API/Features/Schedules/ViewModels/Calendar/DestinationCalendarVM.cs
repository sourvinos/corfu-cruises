using System.Collections.Generic;

namespace API.Features.Schedules {

    public class DestinationCalendarVM {

        // Level 2 of 3

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }

        public IEnumerable<PortCalendarVM> Ports { get; set; } // Level 3 of 3

    }

}