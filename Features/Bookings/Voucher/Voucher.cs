using System;
using System.Collections.Generic;

namespace CorfuCruises {

    public class Voucher {

        public DateTime Date { get; set; }
        public string Destination { get; set; }
        public VoucherPickupPoint PickupPoint { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string SpecialCare { get; set; }
        public string Remarks { get; set; }
        public string QRCode { get; set; }

        public List<VoucherDetail> Details { get; set; }

    }

}