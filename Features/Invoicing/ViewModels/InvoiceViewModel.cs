using System.Collections.Generic;
using BlueWaterCruises.Features.Customers;

namespace BlueWaterCruises.Features.Invoicing {

    public class InvoiceViewModel {

        public string Date { get; set; }
        public CustomerDropdownResource CustomerResource { get; set; }
        public List<InvoiceReservationViewModel> Reservations { get; set; }
        public List<IsTransferGroupViewModel> IsTransferGroup { get; set; }
        public IsTransferGroupViewModel IsTransferGroupTotal { get; set; }

    }

}