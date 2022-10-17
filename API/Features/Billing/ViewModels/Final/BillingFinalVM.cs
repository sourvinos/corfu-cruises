using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Billing {

    public class BillingFinalVM {

        // Level 1 of 3

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public SimpleEntity Customer { get; set; }
        public List<BillingFinalPortVM> PortGroup { get; set; } // Level 2a of 3
        public List<BillingFinalReservationVM> Reservations { get; set; } // Level 2b of 3

    }

}