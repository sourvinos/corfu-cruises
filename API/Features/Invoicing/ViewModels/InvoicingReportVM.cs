using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Invoicing {

    public class InvoicingReportVM {

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public SimpleResource Customer { get; set; }
        public List<InvoicingPortVM> PortGroup { get; set; }
        public List<InvoicingReservationVM> Reservations { get; set; }

    }

}