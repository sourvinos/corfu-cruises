using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Invoicing {

    public class InvoiceViewModel {

        public string Date { get; set; }
        public SimpleResource Customer { get; set; }
        public List<InvoiceReservationViewModel> Reservations { get; set; }
        public List<HasTransferGroupViewModel> HasTransferGroup { get; set; }
        public HasTransferGroupViewModel HasTransferGroupTotal { get; set; }

    }

}