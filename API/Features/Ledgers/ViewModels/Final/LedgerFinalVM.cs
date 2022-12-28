using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Ledger {

    public class LedgerFinalVM {

        // Level 1 of 3

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public SimpleEntity Customer { get; set; }
        public List<LedgerFinalPortVM> PortGroup { get; set; } // Level 2a of 3
        public List<LedgerFinalReservationVM> Reservations { get; set; } // Level 2b of 3

    }

}