using System.Collections.Generic;
using API.Features.Customers;
using API.Features.Reservations;

namespace API.Features.Invoicing {

    public class InvoiceIntermediateVM {

        public string Port { get; set; }
        // public IEnumerable<int> HasTransfer { get; set; }
        public IEnumerable<TransferGroup> TransferGroup { get; set; }
        public int PortTotal { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

    public class TransferGroup {

        public bool HasTransfer { get; set; }
        public int Passengers { get; set; }

    }

}