using System.Collections.Generic;

namespace API.Features.Seeker {

    public class DestinationCalendarVM {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }

        public IEnumerable<PortCalendarVM> Ports { get; set; }

    }

}