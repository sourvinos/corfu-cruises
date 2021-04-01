using System;
using System.Collections.Generic;

namespace CorfuCruises {

    public class Voucher {

        public DateTime Date { get; set; }
        public string DestinationDescription { get; set; }
        public string PickupPointDescription { get; set; }
        public string PickupPointExactPoint { get; set; }
        public string PickupPointTime { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string SpecialCare { get; set; }
        public string Remarks { get; set; }
        public string URI { get; set; }

        public List<VoucherPassenger> Passengers { get; set; }

    }

}