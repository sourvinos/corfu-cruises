using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Totals {

    public class TotalsReportVM {

        public string Date { get; set; }
        public SimpleResource Customer { get; set; }
        public List<TotalsPortVM> PortGroup { get; set; }
        public List<TotalsReservationVM> Reservations { get; set; }

    }

}