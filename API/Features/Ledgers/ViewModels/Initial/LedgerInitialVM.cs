using System.Collections.Generic;
using API.Features.Reservations;
using API.Infrastructure.Classes;

namespace API.Features.Ledger {

    public class LedgerInitialVM {

        // Level 1

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public SimpleEntity Customer { get; set; }
        public IEnumerable<LedgerInitialPortVM> Ports { get; set; } // Level 2a
        public IEnumerable<LedgerInitialHasTransferGroupVM> HasTransferGroup { get; set; } // Level 2b
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalEmbarked { get; set; }
        public List<Reservation> Reservations { get; set; } // leve 2c

    }

}