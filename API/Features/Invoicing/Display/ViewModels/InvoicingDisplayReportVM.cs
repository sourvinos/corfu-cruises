using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Invoicing.Display {

    public class InvoicingDisplayReportVM {

        public string Date { get; set; }
        public SimpleResource Customer { get; set; }
        public List<InvoicingDisplayPortVM> PortGroup { get; set; }
        public List<InvoicingDisplayReservationVM> Reservations { get; set; }

    }

}