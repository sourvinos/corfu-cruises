using System.Collections.Generic;
using API.Features.Customers;
using API.Features.Reservations;

namespace API.Features.Invoicing {

    public class InvoiceIntermediateViewModel {

        public string Date { get; set; }
        public Customer Customer { get; set; }

        public List<Reservation> Reservations { get; set; }
        public List<IsTransferGroupViewModel> IsTransferGroup { get; set; }

        public IsTransferGroupViewModel IsTransferGroupTotal { get; set; }

    }

}