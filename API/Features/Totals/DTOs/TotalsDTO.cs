using System.Collections.Generic;
using API.Features.Reservations;
using API.Infrastructure.Classes;

namespace API.Features.Totals {

    public class TotalsDTO {

        public string Date { get; set; }
        public SimpleResource Customer { get; set; }
        public IEnumerable<TotalsPortDTO> Ports { get; set; }
        public IEnumerable<TotalsHasTransferGroupDTO> HasTransferGroup { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public int TotalEmbarked { get; set; }
        public List<Reservation> Reservations { get; set; }

    }

}