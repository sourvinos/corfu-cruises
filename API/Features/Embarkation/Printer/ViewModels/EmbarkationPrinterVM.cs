using System.Collections.Generic;

namespace API.Features.Embarkation.Printer {

    public class EmbarkationPrinterVM {

        public string TicketNo { get; set; }
        public string Remarks { get; set; }
        public string Customer { get; set; }
        public string Driver { get; set; }
        public string Ship { get; set; }
        public int TotalPersons { get; set; }

        public List<EmbarkationPrinterPassengerVM> Passengers { get; set; }

    }

}