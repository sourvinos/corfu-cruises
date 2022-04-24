using System.Collections.Generic;
using API.Features.Reservations;
using API.Infrastructure.Classes;

namespace API.Features.Invoicing.Printer {

    public class InvoicingPrinterDTO {

        public string Date { get; set; }
        public SimpleResource Customer { get; set; }
        public IEnumerable<InvoicingPrinterPortDTO> Ports { get; set; }
        public IEnumerable<InvoicingPrinterHasTransferGroupDTO> HasTransferGroup { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}