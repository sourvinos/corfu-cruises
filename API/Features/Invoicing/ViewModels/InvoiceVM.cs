using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Invoicing {

    public class InvoiceVM {

        public string Date { get; set; }
        public SimpleResource Customer { get; set; }
        public List<InvoiceReservationVM> Reservations { get; set; }
        public List<InvoicePortVM> PortGroup { get; set; }

    }

}