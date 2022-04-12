using System.Collections.Generic;

namespace API.Features.Embarkation.Display {

    public class EmbarkationDisplayVM {

        public string TicketNo { get; set; }
        public string Remarks { get; set; }
        public string Customer { get; set; }
        public string Driver { get; set; }
        public string Ship { get; set; }
        public int TotalPersons { get; set; }

        public List<EmbarkationDisplayPassengerVM> Passengers { get; set; }

    }

}