using System.Collections.Generic;
using API.Infrastructure.Classes;

namespace API.Features.Billing {

    public class BillingFinalVM {

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public SimpleResource Customer { get; set; }
        public List<BillingFinalPortVM> PortGroup { get; set; }
        public List<BillingFinalReservationVM> Reservations { get; set; }

    }

}