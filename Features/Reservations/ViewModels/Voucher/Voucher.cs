using System;
using System.Collections.Generic;

namespace BlueWaterCruises.Features.Reservations {

    public class Voucher {

        public string Logo { get; set; }

        public DateTime Date { get; set; }
        public string DestinationDescription { get; set; }
        public string PickupPointDescription { get; set; }
        public string PickupPointExactPoint { get; set; }
        public string PickupPointTime { get; set; }
        public string TicketNo { get; set; }
        public string Email { get; set; }
        public string Phones { get; set; }
        public string Remarks { get; set; }

        public string Uri { get; set; }

        public string Facebook { get; set; }
        public string YouTube { get; set; }
        public string Instagram { get; set; }

        public List<VoucherPassenger> Passengers { get; set; }

    }

}