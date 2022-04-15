using System.Collections.Generic;
using API.Features.Reservations;

namespace API.Features.Invoicing {

    public class InvoicingDTO {

        public string Customer { get; set; }
        public IEnumerable<InvoicingPortDTO> Ports { get; set; }
        public IEnumerable<InvoicingHasTransferGroupDTO> HasTransferGroup { get; set; }
        public int TotalPersons { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}