using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Ledger {

    public class LedgerVM {

        public string Date { get; set; }
        public SimpleEntity Customer { get; set; }
        public IEnumerable<LedgerPortVM> Ports { get; set; }
        public IEnumerable<LedgerHasTransferGroupVM> HasTransferGroup { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalEmbarked { get; set; }
        public List<LedgerReservationVM> Reservations { get; set; }

    }

}