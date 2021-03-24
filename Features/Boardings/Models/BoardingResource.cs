using System.Collections.Generic;

namespace CorfuCruises {

    public class BoardingResource {

        public int BookingId { get; set; }
        public string TicketNo { get; set; }

        public List<BookingDetailResource> Details { get; set; }

    }

}