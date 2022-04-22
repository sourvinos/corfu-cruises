using System.Collections.Generic;
using API.Features.Reservations;
using API.Infrastructure.Classes;

namespace API.Features.Invoicing.Display {

    public class InvoicingDisplayDTO {

        public string Date { get; set; }
        public SimpleResource Customer { get; set; }
        public IEnumerable<InvoicingDisplayPortDTO> Ports { get; set; }
        public IEnumerable<InvoicingDisplayHasTransferGroupDTO> HasTransferGroup { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}