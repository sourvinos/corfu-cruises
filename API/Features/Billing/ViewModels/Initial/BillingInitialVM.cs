using System.Collections.Generic;
using API.Features.Reservations;
using API.Infrastructure.Classes;

namespace API.Features.Billing {

    public class BillingInitialVM {

        // Level 1

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public SimpleEntity Customer { get; set; }
        public IEnumerable<BillingInitialPortVM> Ports { get; set; } // Level 2a
        public IEnumerable<BillingInitialHasTransferGroupVM> HasTransferGroup { get; set; } // Level 2b
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalEmbarked { get; set; }
        public List<Reservation> Reservations { get; set; } // leve 2c

    }

}