using System.Collections.Generic;

namespace API.Features.Invoicing {

    public class InvoicingReportVM {

        public string Customer { get; set; }
        public List<InvoicingPortVM> PortGroup { get; set; }
        public List<InvoicingReservationVM> Reservations { get; set; }

    }

}