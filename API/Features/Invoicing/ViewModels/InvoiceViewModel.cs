using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Invoicing {

    public class InvoiceViewModel {

        public string Date { get; set; }
        public SimpleResource CustomerResource { get; set; }
        public List<InvoiceReservationViewModel> Reservations { get; set; }
        public List<IsTransferGroupViewModel> IsTransferGroup { get; set; }
        public IsTransferGroupViewModel IsTransferGroupTotal { get; set; }

    }

}