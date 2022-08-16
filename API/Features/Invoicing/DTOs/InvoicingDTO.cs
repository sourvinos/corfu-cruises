using System;
using System.Collections.Generic;
using API.Features.Reservations;
using API.Infrastructure.Classes;

namespace API.Features.Invoicing {

    public class InvoicingDTO {

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public SimpleResource Customer { get; set; }
        public IEnumerable<InvoicingPortDTO> Ports { get; set; }
        public IEnumerable<InvoicingHasTransferGroupDTO> HasTransferGroup { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalEmbarked { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}