using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Invoicing.Printer {

    public class InvoicingPrinterVM {

        public string Date { get; set; }
        public SimpleResource Customer { get; set; }
        public List<InvoicingPrinterPortVM> PortGroup { get; set; }
        public List<InvoicingPrinterReservationVM> Reservations { get; set; }

    }

}