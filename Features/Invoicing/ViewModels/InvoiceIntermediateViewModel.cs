using System.Collections.Generic;
using BlueWaterCruises.Features.Customers;
using BlueWaterCruises.Features.Reservations;

namespace BlueWaterCruises.Features.Invoicing {

    public class InvoiceIntermediateViewModel {

        public string Date { get; set; }
        public Customer Customer { get; set; }

        public List<Reservation> Reservations { get; set; }
        public List<IsTransferGroupViewModel> IsTransferGroup { get; set; }

        public IsTransferGroupViewModel IsTransferGroupTotal { get; set; }

     }

}